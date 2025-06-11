import React from 'react';

export default function SimpleTableView({ questions }) {
  return (
    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border">
      <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="px-3 py-2">Link</th>
          <th className="px-3 py-2">Type</th>
          <th className="px-3 py-2">Topic</th>
          <th className="px-3 py-2">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, idx) => (
          <tr key={idx} className="border-b">
            <td className="px-3 py-2">
              {q.link?.startsWith("http") ? (
                <a href={q.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {q.link}
                </a>
              ) : (
                q.link
              )}
            </td>
            <td className="px-3 py-2">{q.type}</td>
            <td className="px-3 py-2">{q.topic}</td>
            <td className="px-3 py-2">{q.difficulty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 
