/**
 * Grok API Client
 * 
 * Client for interacting with Groq API for LLM chat completions
 * Note: Groq does NOT provide embeddings - we use Cohere for embeddings (free tier)
 * Includes retry logic, error handling, and rate limit detection
 */

// Environment variable validation
function validateGrokEnv(): { apiKey: string; baseUrl: string } {
  const apiKey = process.env.GROK_API_KEY;
  const baseUrl = process.env.GROK_API_BASE_URL || 'https://api.groq.com/openai/v1';

  if (!apiKey) {
    throw new Error('GROK_API_KEY environment variable is required');
  }

  if (!apiKey.startsWith('gsk_')) {
    throw new Error('GROK_API_KEY must start with "gsk_" (Groq API key format)');
  }

  return { apiKey, baseUrl };
}

// Custom error classes
export class GrokAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'GrokAPIError';
  }
}

export class RateLimitError extends GrokAPIError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends GrokAPIError {
  constructor(message: string) {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

// Request/Response types
export interface EmbeddingRequest {
  input: string | string[];
  model?: string;
}

export interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GrokClientConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

export class GrokClient {
  private config: GrokClientConfig;

  constructor(config?: Partial<GrokClientConfig>) {
    const env = validateGrokEnv();

    this.config = {
      apiKey: env.apiKey,
      baseUrl: env.baseUrl,
      timeout: config?.timeout || 30000, // 30 seconds
      maxRetries: config?.maxRetries || 3,
      retryDelay: config?.retryDelay || 1000, // 1 second
    };
  }

  /**
   * Generate embeddings for text input
   * Note: Groq doesn't provide embeddings, so we use Cohere's API (free tier)
   */
  async createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.retryWithBackoff(async () => {
      try {
        const cohereApiKey = process.env.COHERE_API_KEY;
        if (!cohereApiKey) {
          throw new GrokAPIError('COHERE_API_KEY is required for embeddings (Groq does not provide embeddings)');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        // Use Cohere's API for embeddings
        const response = await fetch('https://api.cohere.ai/v1/embed', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cohereApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: Array.isArray(request.input) ? request.input : [request.input],
            model: request.model || 'embed-english-light-v3.0',
            input_type: 'search_document',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw new RateLimitError('Cohere API rate limit exceeded', retryAfter);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new GrokAPIError(
            `Cohere API error: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        const cohereData = await response.json();

        // Convert Cohere response to OpenAI-compatible format
        const data: EmbeddingResponse = {
          data: cohereData.embeddings.map((embedding: number[], index: number) => ({
            embedding,
            index,
          })),
          model: cohereData.model || 'embed-english-light-v3.0',
          usage: {
            prompt_tokens: cohereData.meta?.billed_units?.input_tokens || 0,
            total_tokens: cohereData.meta?.billed_units?.input_tokens || 0,
          },
        };

        // Log successful request
        console.log(`[Grok] Generated embeddings for ${cohereData.embeddings.length} input(s) using Cohere`);

        return data;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new TimeoutError('Embedding API request timed out');
        }
        throw error;
      }
    });
  }

  /**
   * Generate chat completion
   */
  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    return this.retryWithBackoff(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: request.messages,
            model: request.model || 'grok-beta',
            temperature: request.temperature ?? 0.7,
            max_tokens: request.max_tokens,
            stream: request.stream ?? false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw new RateLimitError('Grok API rate limit exceeded', retryAfter);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new GrokAPIError(
            `Grok API error: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();

        // Log successful request
        console.log(`[Grok] Generated chat completion with ${data.usage?.total_tokens || 0} tokens`);

        return data;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new TimeoutError('Grok API request timed out');
        }
        throw error;
      }
    });
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      // Don't retry on certain errors
      if (
        error instanceof TimeoutError ||
        error instanceof RateLimitError ||
        (error instanceof GrokAPIError && error.statusCode && error.statusCode < 500)
      ) {
        console.error(`[Grok] Non-retryable error: ${error.message}`);
        throw error;
      }

      // Check if we should retry
      if (attempt >= this.config.maxRetries) {
        console.error(`[Grok] Max retries (${this.config.maxRetries}) exceeded for error: ${error.message}`);
        throw error;
      }

      // Calculate delay with exponential backoff (with jitter)
      const baseDelay = this.config.retryDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000; // Add up to 1 second of jitter
      const delay = baseDelay + jitter;

      console.warn(`[Grok] Request failed: ${error.message}`);
      console.warn(`[Grok] Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${this.config.maxRetries})`);

      await new Promise(resolve => setTimeout(resolve, delay));

      return this.retryWithBackoff(fn, attempt + 1);
    }
  }

  /**
   * Test connection to Grok API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test chat completion (Groq's actual service)
      await this.createChatCompletion({
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
      });
      return true;
    } catch (error) {
      console.error('[Grok] Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let grokClientInstance: GrokClient | null = null;

export function getGrokClient(): GrokClient {
  if (!grokClientInstance) {
    grokClientInstance = new GrokClient();
  }
  return grokClientInstance;
}

export default GrokClient;
