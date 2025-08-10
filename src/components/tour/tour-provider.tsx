'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from '@/context/app-context';

// Simple tour step type
interface TourStep {
  selector: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

// Tour steps
const tourSteps: TourStep[] = [
  {
    selector: 'body',
    content: 'Welcome to Amatech Learning Hub! Let\'s take a quick tour to help you get started.',
    position: 'center',
  },
  {
    selector: '[data-tour="main-nav"]',
    content: 'Use this sidebar to navigate between different sections like Dashboard, Courses, and Timetable.',
    position: 'right',
  },
  {
    selector: '[data-tour="dashboard-welcome"]',
    content: 'Your dashboard shows a personalized welcome message and quick access to important features.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="recently-accessed"]',
    content: 'This section shows your recently viewed courses and materials for quick access.',
    position: 'top',
  },
  {
    selector: '[data-tour="timetable-widget"]',
    content: 'Keep track of your class schedule with this pinned timetable widget.',
    position: 'left',
  },
  {
    selector: '[data-tour="ai-assistant"]',
    content: 'Get help with your studies using our AI-powered assistant. Ask questions about your courses!',
    position: 'bottom',
  },
  {
    selector: '[data-tour="user-profile"]',
    content: 'Access your profile settings, account information, and logout options here.',
    position: 'bottom',
  },
];

interface TourContextType {
  startTour: () => void;
  isOpen: boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  closeTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

// Simple tour overlay component
function TourOverlay({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose
}: {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const element = document.querySelector(step.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      // Adjust position based on step position
      switch (step.position) {
        case 'top':
          top = rect.top + scrollTop - 10;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - 10;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 10;
          break;
        case 'center':
        default:
          top = window.innerHeight / 2 + scrollTop;
          left = window.innerWidth / 2 + scrollLeft;
          break;
      }

      setPosition({ top, left });
    }
  }, [step]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Tour popup */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: position.top, left: position.left }}
      >
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <p className="text-gray-800">{step.content}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Tour
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Previous
              </button>
            )}

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={onNext}
                className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700 rounded"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { currentUser } = useAppContext();

  // Auto-start tour for first-time users
  useEffect(() => {
    if (currentUser?.isFirstTime && !currentUser?.tourCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 second delay to let page load

      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTour = async () => {
    setIsOpen(false);
    setCurrentStep(0);

    // Mark tour as completed
    if (currentUser && (currentUser.isFirstTime || !currentUser.tourCompleted)) {
      try {
        const response = await fetch('/api/v1/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            tourCompleted: true,
            isFirstTime: false,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update tour completion status');
        }
      } catch (error) {
        console.error('Error updating tour completion:', error);
      }
    }
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
        isOpen,
        currentStep,
        nextStep,
        prevStep,
        closeTour
      }}
    >
      {children}
      {isOpen && (
        <TourOverlay
          step={tourSteps[currentStep]}
          currentStep={currentStep}
          totalSteps={tourSteps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={closeTour}
        />
      )}
    </TourContext.Provider>
  );
}
