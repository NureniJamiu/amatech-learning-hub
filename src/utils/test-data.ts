// Test utility to populate recently accessed items
// Run this in the browser console to see the Recently Accessed card with sample data

export function populateRecentlyAccessedData() {
  const sampleData = [
    {
      id: "material-1",
      title: "MTE 301 Course Material 1",
      type: "material",
      courseCode: "MTE 301",
      courseTitle: "Engineering Economics",
      accessedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      fileUrl: "/pdfs/stakeholders.pdf"
    },
    {
      id: "pq-1",
      title: "MTE 303 Past Question 2023",
      type: "pastQuestion",
      courseCode: "MTE 303",
      courseTitle: "Thermodynamics",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      fileUrl: "/pdfs/stakeholders.pdf",
      year: 2023
    },
    {
      id: "material-2",
      title: "MTE 305 Course Material 1",
      type: "material",
      courseCode: "MTE 305",
      courseTitle: "Fluid Mechanics",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      fileUrl: "/pdfs/stakeholders.pdf"
    },
    {
      id: "pq-2",
      title: "MTE 301 Past Question 2022",
      type: "pastQuestion",
      courseCode: "MTE 301",
      courseTitle: "Engineering Economics",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      fileUrl: "/pdfs/stakeholders.pdf",
      year: 2022
    },
    {
      id: "material-3",
      title: "MTE 307 Course Material 2",
      type: "material",
      courseCode: "MTE 307",
      courseTitle: "Materials Science",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      fileUrl: "/pdfs/stakeholders.pdf"
    }
  ];

  localStorage.setItem('amatech_recently_accessed', JSON.stringify(sampleData));
  console.log('Sample recently accessed data populated! Refresh the page to see the Recently Accessed card.');
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).populateRecentlyAccessedData = populateRecentlyAccessedData;
}
