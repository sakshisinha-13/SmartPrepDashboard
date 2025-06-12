import { useState, useEffect } from 'react';
import microsoftData from '../data/microsoft_questions.json';
import servicenowData from '../data/servicenow_questions.json';
import { Pie } from 'react-chartjs-2';
import { exportToCSV } from '../exports/exportCSV';
import { exportToMarkdown } from '../exports/exportMarkdown';
import { exportToPDFmake } from '../exports/exportPDFmake';
import SimpleTableView from '../exports/SimpleTableView';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const allCompanies = {
    Microsoft: microsoftData,
    ServiceNow: servicenowData
};

const topicLabels = {
    dsa: "Data Structures & Algorithms",
    os: "Operating System",
    dbms: "Database Management System",
    oops: "Object Oriented Programming",
    system_design: "System Design",
    behavioral: "HR / Behavioral"
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [role, setRole] = useState('');
    const [yoe, setYoe] = useState('');
    const [assessmentType, setAssessmentType] = useState('');
    const [topic, setTopic] = useState('');
    const [year, setYear] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [simpleView, setSimpleView] = useState(false);
    const [noMatch, setNoMatch] = useState(false);

    const [tickedQuestions, setTickedQuestions] = useState({});

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleSearch = () => {
        const matches = Object.keys(allCompanies)
            .filter(companyName =>
                companyName.toLowerCase().includes(query.toLowerCase())
            )
            .map(companyName => allCompanies[companyName]);

        setSelectedCompanies(matches.length > 0 ? matches : []);
        setNoMatch(matches.length === 0);

        setRole('');
        setYoe('');
        setAssessmentType('');
        setTopic('');
        setYear('');
        setDifficulty('');
        setSimpleView(false);
        setTickedQuestions({});
    };

    const toggleTick = (link) => {
        setTickedQuestions(prev => ({
            ...prev,
            [link]: !prev[link]
        }));
    };

    const getFilteredQuestions = () => {
        if (selectedCompanies.length === 0) return [];

        // Filter companies by role and yoe
        const filteredCompanies = selectedCompanies.filter(c => {
            if (role && c.role !== role) return false;
            if (yoe && c.yoe !== yoe) return false;
            return true;
        });

        let results = [];

        filteredCompanies.forEach(company => {
            if (assessmentType === 'OA') {
                const oaData = company.oa || {};
                const entries = year && oaData[year] ? { [year]: oaData[year] } : oaData;

                for (const [yr, questions] of Object.entries(entries)) {
                    for (const q of questions) {
                        if (typeof q === 'string') {
                            if (!difficulty) results.push({ type: 'OA', link: q });
                        } else if (typeof q === 'object' && (!difficulty || q.difficulty === difficulty)) {
                            results.push({
                                type: 'OA',
                                link: q.link || '',
                                difficulty: q.difficulty,
                                topic: q.topic || 'General',
                                year: q.year || yr
                            });
                        }
                    }
                }
            }

            if (assessmentType === 'Interview') {
                const interviewData = company.interview || {};
                for (const [section, items] of Object.entries(interviewData)) {
                    if (topic && topic !== section.toLowerCase()) continue;
                    const filteredItems = items.filter(q => {
                        if (typeof q === 'object') {
                            const matchYear = !year || q.year === year;
                            const matchDiff = !difficulty || q.difficulty === difficulty;
                            return matchYear && matchDiff;
                        }
                        return !difficulty;
                    });
                    results.push(...filteredItems.map(q => ({
                        type: topicLabels[section] || section,
                        link: typeof q === 'string' ? q : q.link || q.question || '',
                        difficulty: typeof q === 'object' ? q.difficulty : undefined,
                        topic: typeof q === 'object' ? q.topic || topicLabels[section] || section : topicLabels[section] || section,
                        year: typeof q === 'object' ? q.year : undefined
                    })));
                }
            }
        });

        return results;
    };

    // Gather years from all selected companies for the year filter
    const getInterviewYears = () => {
        const years = selectedCompanies.flatMap(company => {
            const interviewData = company.interview || {};
            return Object.values(interviewData).flat().map(q => (typeof q === 'object' && q.year)).filter(Boolean);
        });
        return [...new Set(years)].sort();
    };

    const filteredQuestions = getFilteredQuestions();

    const topicCounts = filteredQuestions.reduce((acc, q) => {
        const label = q.topic || 'General';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {});

    const repeatedQuestions = {};
    filteredQuestions.forEach(q => {
        const key = q.link || q.question || '';
        repeatedQuestions[key] = (repeatedQuestions[key] || 0) + 1;
    });

    const hotQuestions = Object.entries(repeatedQuestions)
        .filter(([_, count]) => count > 1)
        .map(([link, count]) => ({ link, count }))
        .sort((a, b) => b.count - a.count);

    const topicNames = Object.keys(topicCounts).sort();
    const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#DB2777', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444', '#6366F1'];
    const topicColorMap = topicNames.reduce((acc, topic, idx) => {
        acc[topic] = palette[idx % palette.length];
        return acc;
    }, {});

    const chartData = {
        labels: topicNames,
        datasets: [{
            data: topicNames.map(topic => topicCounts[topic]),
            backgroundColor: topicNames.map(topic => topicColorMap[topic]),
            borderWidth: 1
        }]
    };

    return (
        <div className={`min-h-screen px-6 py-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
            <div className="w-full mx-auto space-y-8">

                {/* Search Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md space-y-6">
                    <h1 className="text-2xl font-bold">Search Company</h1>
                    <div className="flex flex-wrap gap-4">
                        <input
                            className="px-4 py-3 flex-1 border rounded-md dark:bg-gray-700 text-lg"
                            placeholder="Search Company (e.g., Microsoft)"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <button onClick={handleSearch} className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition">
                            Search
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-600 rounded-md text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            title="Toggle Dark Mode"
                        >
                            {darkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                        {noMatch && (
                            <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 p-4 rounded-md text-center font-semibold mt-4 w-full">
                                No questions found for this company.
                            </div>
                        )}


                    </div>

                    {/* Role & YOE Row */}
                    {selectedCompanies.length > 0 && (
                        <div className="flex flex-wrap gap-6 mt-6">
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                            >
                                <option value="">Select Role</option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="SDE-1">SDE-1</option>
                                <option value="SDE-2">SDE-2</option>
                                <option value="Intern">SDE-3</option>
                                <option value="Backend Developer">Backend Developer</option>
                            </select>
                            <select
                                value={yoe}
                                onChange={e => setYoe(e.target.value)}
                                className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                            >
                                <option value="">Years of Experience</option>
                                <option value="College Graduate">College Graduate</option>
                                <option value="0">1</option>
                                <option value="1">2+</option>
                                <option value="2">3+</option>
                                <option value="3+">4+</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Filters Section */}
                {selectedCompanies.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <select
                            value={assessmentType}
                            onChange={e => setAssessmentType(e.target.value)}
                            className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                        >
                            <option value="">Select Round</option>
                            <option value="OA">Online Assessment</option>
                            <option value="Interview">Interview</option>
                        </select>
                        <select
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                        >
                            <option value="">All Topics</option>
                            {Object.keys(topicLabels).map(k => (
                                <option key={k} value={k}>
                                    {topicLabels[k]}
                                </option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                        >
                            <option value="">All Years</option>
                            {(assessmentType === 'OA'
                                ? selectedCompanies.flatMap(c => Object.keys(c.oa || {}))
                                : getInterviewYears()
                            ).map(yr => (
                                <option key={yr} value={yr}>
                                    {yr}
                                </option>
                            ))}
                        </select>
                        <select
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                            className="p-3 border rounded-md dark:bg-gray-700 text-lg"
                        >
                            <option value="">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                )}

                {/* Export & Results Section */}
                {filteredQuestions.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md space-y-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                onClick={() => exportToCSV(filteredQuestions)}
                                className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition"
                            >
                                CSV
                            </button>
                            <button
                                onClick={() => exportToMarkdown(filteredQuestions)}
                                className="bg-yellow-500 text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-600 transition"
                            >
                                Markdown
                            </button>
                            <button
                                onClick={() => exportToPDFmake(filteredQuestions)}
                                className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
                            >
                                PDF
                            </button>
                            <button
                                onClick={() => setSimpleView(!simpleView)}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                {simpleView ? 'Detailed View' : 'Table View'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Left: Questions Box */}
                            <div className="bg-white dark:bg-gray-900 rounded-md p-6 shadow-md lg:col-span-3 border-r border-gray-300 dark:border-gray-700
">
                                {simpleView ? (
                                    <SimpleTableView questions={filteredQuestions} />
                                ) : (
                                    <ul className="space-y-6">
                                        {filteredQuestions.map((q, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={!!tickedQuestions[q.link]}
                                                    onChange={() => toggleTick(q.link)}
                                                    className="w-5 h-5 mt-1 cursor-pointer"
                                                />
                                                <div className="flex flex-col">
                                                    {q.link?.startsWith('http') ? (
                                                        <a
                                                            href={q.link}
                                                            className="text-blue-600 dark:text-white underline break-words max-w-[90vw] text-lg font-semibold"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {q.link}
                                                        </a>
                                                    ) : (
                                                        <span>{q.link}</span>
                                                    )}
                                                    <div className="flex gap-4 text-xs mt-1 flex-wrap">
                                                        {q.topic && (
                                                            <span
                                                                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                                style={{ backgroundColor: topicColorMap[q.topic] || '#6B7280' }}
                                                            >
                                                                {q.topic}
                                                            </span>
                                                        )}
                                                        {q.difficulty && (
                                                            <span
                                                                className={`px-3 py-1 rounded-full font-medium text-xs ${q.difficulty === 'Easy'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
                                                                    : q.difficulty === 'Medium'
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
                                                                    }`}
                                                            >
                                                                {q.difficulty}
                                                            </span>

                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Right: Insights Box */}
                            <div className="bg-white dark:bg-gray-900 rounded-md p-6 shadow-md space-y-8 ">
                                <div>
                                    <h3 className="font-bold mb-3 text-center">Questions by Topic</h3>
                                    <div className="h-[320px]">
                                        <Pie
                                            data={chartData}
                                            options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-200 dark:bg-blue-900 p-4 rounded-md">
                                    <h3 className="font-bold mb-2">📌 Company Insights</h3>
                                    <p className="text-sm">
                                        {query.trim()} {role ? role : ''} {assessmentType === 'OA' ? 'OA' : 'Interview'}:{' '}
                                        {Object.entries(topicCounts)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 5)
                                            .map(([topic, count]) => `${((count / filteredQuestions.length) * 100).toFixed(0)}% ${topic}`)
                                            .join(', ')}
                                    </p>
                                </div>

                                {assessmentType === 'Interview' && (
                                    <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-md max-h-44 ">
                                        <h3 className="font-bold mb-2">📆 Year-wise Frequency</h3>
                                        <ul className="text-sm list-disc pl-5">
                                            {[...new Set(filteredQuestions.map(q => q.year).filter(Boolean))]
                                                .sort()
                                                .map(yr => (
                                                    <li key={yr}>
                                                        {yr}: {filteredQuestions.filter(q => q.year === yr).length} question(s)
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}

                                {hotQuestions.length > 0 && (
                                    <div className="bg-red-300 dark:bg-red-400 p-4 rounded-md max-h-44 ">
                                        <h3 className="font-bold mb-2">🔥 Most Repeated Questions</h3>
                                        <ul className="text-sm list-disc pl-5">
                                            {hotQuestions.map((q, idx) => (
                                                <li key={idx}>
                                                    <a href={q.link} target="_blank" rel="noreferrer" className="text-indigo-900 underline break-words max-w-[90vw] text-lg">
                                                        {q.link}
                                                    </a>{' '}
                                                    – {q.count} times
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    selectedCompanies.length > 0 && (
                        <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-300 p-4 rounded-md text-center font-semibold">
                            No questions found for the selected filters.
                        </div>
                    )
                )}

            </div>
        </div>
    );
}
