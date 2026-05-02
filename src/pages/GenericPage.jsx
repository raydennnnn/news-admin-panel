const GenericPage = ({ title }) => (
  <div className="max-w-7xl mx-auto space-y-6">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
    </div>
    <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-8 text-center text-gray-500">
      {title} content is under development.
    </div>
  </div>
);

export default GenericPage;
