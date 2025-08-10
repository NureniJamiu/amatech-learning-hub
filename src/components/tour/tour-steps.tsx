import type { StepType } from '@reactour/tour';

export const tourSteps: StepType[] = [
  {
    selector: '.tour-welcome',
    content: (
      <div className="space-y-4">
        <div className="text-lg font-semibold text-green-700">
          🎉 Welcome to Amatech Lasu!
        </div>
        <p className="text-gray-700">
          We're excited to have you here! This quick tour will show you around the platform and help you get started with your learning journey.
        </p>
        <div className="text-sm text-gray-500">
          Don't worry, you can always access this tour later from your profile menu.
        </div>
      </div>
    ),
    position: 'center',
  },
  {
    selector: '[data-tour="sidebar-logo"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Navigation Sidebar</div>
        <p>This is your main navigation hub. From here you can access all the key features of the platform.</p>
        <div className="text-sm text-gray-600">
          💡 Tip: Click the logo or use the hamburger menu to collapse/expand the sidebar.
        </div>
      </div>
    ),
    position: 'right',
  },
  {
    selector: '[data-tour="main-nav"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Main Navigation</div>
        <p>These are your primary navigation options:</p>
        <ul className="text-sm space-y-1 mt-2">
          <li>📊 <strong>Dashboard</strong> - Your overview and quick access</li>
          <li>📚 <strong>Courses</strong> - Browse and access course materials</li>
          <li>📅 <strong>Timetable</strong> - Manage your class schedule</li>
          <li>🤖 <strong>AI Assistant</strong> - Get help with your studies</li>
        </ul>
      </div>
    ),
    position: 'right',
  },
  {
    selector: '[data-tour="courses-section"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Course Management</div>
        <p>This section shows your enrolled courses and recently accessed materials.</p>
        <div className="text-sm text-gray-600">
          You can access course materials, past questions, and study resources from here.
        </div>
      </div>
    ),
    position: 'right',
  },
  {
    selector: '[data-tour="header-actions"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Quick Actions</div>
        <p>Access important features quickly:</p>
        <ul className="text-sm space-y-1 mt-2">
          <li>🔔 Notifications for updates</li>
          <li>🔍 Search across all content</li>
          <li>⚙️ Settings and preferences</li>
        </ul>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '[data-tour="dashboard-content"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Dashboard Overview</div>
        <p>Your personalized dashboard shows:</p>
        <ul className="text-sm space-y-1 mt-2">
          <li>📈 Recent activity and progress</li>
          <li>📋 Upcoming deadlines and events</li>
          <li>📖 Recently accessed materials</li>
          <li>🎯 Recommended study resources</li>
        </ul>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '[data-tour="profile-menu"]',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Your Profile</div>
        <p>Click here to:</p>
        <ul className="text-sm space-y-1 mt-2">
          <li>👤 View and edit your profile</li>
          <li>⚙️ Adjust your preferences</li>
          <li>🎯 Restart this tour anytime</li>
          <li>🚪 Logout when you're done</li>
        </ul>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '.tour-completion',
    content: (
      <div className="space-y-4">
        <div className="text-lg font-semibold text-green-700">
          🎊 Tour Complete!
        </div>
        <p className="text-gray-700">
          You're all set to start exploring! Remember, you can access help and tutorials anytime from your profile menu.
        </p>
        <div className="bg-green-50 p-3 rounded-lg text-sm">
          <strong>Next steps:</strong>
          <ol className="mt-2 space-y-1 ml-4 list-decimal">
            <li>Browse your courses to find materials</li>
            <li>Set up your timetable</li>
            <li>Try the AI assistant for study help</li>
          </ol>
        </div>
        <div className="text-sm text-gray-500">
          Happy learning! 🚀
        </div>
      </div>
    ),
    position: 'center',
  },
];

// Mobile-specific tour steps (simplified)
export const mobileTourSteps: StepType[] = [
  {
    selector: '.tour-welcome',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold text-green-700">
          🎉 Welcome to Amatech Lasu!
        </div>
        <p className="text-sm text-gray-700">
          Quick mobile tour to get you started!
        </p>
      </div>
    ),
    position: 'center',
  },
  {
    selector: '[data-tour="mobile-menu"]',
    content: (
      <div className="space-y-2">
        <div className="font-semibold">Mobile Menu</div>
        <p className="text-sm">Tap here to access navigation on mobile.</p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '[data-tour="dashboard-content"]',
    content: (
      <div className="space-y-2">
        <div className="font-semibold">Your Dashboard</div>
        <p className="text-sm">Swipe and scroll to explore your learning content.</p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '.tour-completion',
    content: (
      <div className="space-y-3">
        <div className="text-lg font-semibold text-green-700">
          🎊 Ready to Go!
        </div>
        <p className="text-sm text-gray-700">
          You're all set! Explore your courses and start learning.
        </p>
      </div>
    ),
    position: 'center',
  },
];
