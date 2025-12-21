import ProjectsList from '../../components/portfolio/ProjectsList';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A showcase of my development work and side projects
          </p>
        </div>

        {/* Projects List */}
        <ProjectsList />
      </div>
    </div>
  );
}
