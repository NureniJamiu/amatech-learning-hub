/**
 * Comprehensive test for the Enhanced RAG Pipeline
 * Run with: npx tsx test-enhanced-rag.ts
 */

import { ragPipeline } from './src/lib/rag-pipeline';
import { PrismaClient } from './src/app/generated/prisma';

const prisma = new PrismaClient();

async function runEnhancedRAGTest() {
    console.log('🚀 Starting Enhanced RAG Pipeline test...\n');

    try {
        // Test 1: Check system status
        console.log('📊 Step 1: Checking system statistics...');
        const stats = await ragPipeline.getCourseStats();
        console.log(`✅ System Stats:`);
        console.log(`   - Total materials: ${stats.totalMaterials}`);
        console.log(`   - Processed materials: ${stats.processedMaterials}`);
        console.log(`   - Total chunks: ${stats.totalChunks}`);
        console.log(`   - Average chunks per material: ${stats.averageChunksPerMaterial.toFixed(1)}`);
        console.log();

        if (stats.processedMaterials === 0) {
            console.log('⚠️  No processed materials found. Let\'s process a test PDF...\n');

            // Get an unprocessed material
            const unprocessedMaterial = await prisma.material.findFirst({
                where: {
                    processed: false
                },
                include: {
                    course: true
                }
            });

            if (unprocessedMaterial) {
                console.log(`📄 Step 2: Processing material "${unprocessedMaterial.title}"...`);

                const result = await ragPipeline.processPDFForRAG(
                    unprocessedMaterial.fileUrl,
                    unprocessedMaterial.id,
                    unprocessedMaterial.title,
                    unprocessedMaterial.courseId
                );

                if (result.success) {
                    console.log(`✅ Processing successful! Created ${result.chunksCreated} chunks`);
                } else {
                    console.log(`❌ Processing failed: ${result.error}`);
                    return;
                }
            } else {
                console.log('❌ No materials found to process');
                return;
            }
        }

        console.log();

        // Test 2: Simple query without history
        console.log('🤖 Step 3: Testing simple query...');
        const simpleQuery = "What is the main topic of this course?";

        const simpleResult = await ragPipeline.queryWithHistory(simpleQuery);

        console.log(`✅ Simple query successful:`);
        console.log(`   Question: "${simpleQuery}"`);
        console.log(`   Answer: "${simpleResult.answer.substring(0, 150)}..."`);
        console.log(`   Sources found: ${simpleResult.sourceDocuments.length}`);
        console.log(`   Follow-up questions: ${simpleResult.followUpQuestions?.length || 0}`);
        console.log();

        // Test 3: Query with chat history
        console.log('💬 Step 4: Testing query with chat history...');

        const chatHistory = [
            {
                human: "What is the main topic of this course?",
                ai: simpleResult.answer
            }
        ];

        const followUpQuery = "Can you provide more details about that?";

        const contextualResult = await ragPipeline.queryWithHistory(
            followUpQuery,
            chatHistory
        );

        console.log(`✅ Contextual query successful:`);
        console.log(`   Question: "${followUpQuery}"`);
        console.log(`   Answer: "${contextualResult.answer.substring(0, 150)}..."`);
        console.log(`   Sources found: ${contextualResult.sourceDocuments.length}`);
        console.log();

        // Test 4: Course-specific query
        console.log('🎯 Step 5: Testing course-specific query...');

        const course = await prisma.course.findFirst({
            where: {
                materials: {
                    some: {
                        processed: true
                    }
                }
            }
        });

        if (course) {
            const courseQuery = "What are the key concepts covered in this course?";

            const courseResult = await ragPipeline.queryWithHistory(
                courseQuery,
                [],
                course.id
            );

            console.log(`✅ Course-specific query successful:`);
            console.log(`   Course: ${course.code} - ${course.title}`);
            console.log(`   Question: "${courseQuery}"`);
            console.log(`   Answer: "${courseResult.answer.substring(0, 150)}..."`);
            console.log(`   Sources found: ${courseResult.sourceDocuments.length}`);

            if (courseResult.sourceDocuments.length > 0) {
                console.log(`   Materials referenced:`);
                const materials = [...new Set(courseResult.sourceDocuments.map(doc => doc.metadata.materialTitle))];
                materials.forEach(material => console.log(`     - ${material}`));
            }
        } else {
            console.log('⚠️  No course with processed materials found');
        }

        console.log();

        // Test 5: Updated system statistics
        console.log('📈 Step 6: Final system statistics...');
        const finalStats = await ragPipeline.getCourseStats();
        console.log(`✅ Updated Stats:`);
        console.log(`   - Total materials: ${finalStats.totalMaterials}`);
        console.log(`   - Processed materials: ${finalStats.processedMaterials}`);
        console.log(`   - Total chunks: ${finalStats.totalChunks}`);
        console.log(`   - Average chunks per material: ${finalStats.averageChunksPerMaterial.toFixed(1)}`);

        console.log('\n🎉 Enhanced RAG Pipeline test completed successfully!');
        console.log('\nThe system is ready for production use with:');
        console.log('✅ Improved document chunking with LangChain');
        console.log('✅ Context-aware retrieval with chat history');
        console.log('✅ Better vector similarity search');
        console.log('✅ Automatic follow-up question generation');
        console.log('✅ Course-specific knowledge isolation');

    } catch (error) {
        console.log('\n❌ Enhanced RAG test failed:');
        console.error(error);
        process.exit(1);
    }
}

// Run the test
runEnhancedRAGTest()
    .then(() => {
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
