import SkillsSection from '../../components/portfolio/SkillsSection';

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Technologies
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills Section */}
        <SkillsSection />
      </div>
    </div>
  );
}
