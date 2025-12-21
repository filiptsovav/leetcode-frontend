import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export default function AdvancedSearch() {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    query: "",
    dateFrom: "",
    dateTo: "",
    minTries: "",
    maxTries: "",
    sortBy: "date",
    sortDir: "desc"
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const performSearch = async (pageNum = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom + "T00:00:00");
      if (filters.dateTo) params.append("dateTo", filters.dateTo + "T23:59:59");
      if (filters.minTries) params.append("minTries", filters.minTries);
      if (filters.maxTries) params.append("maxTries", filters.maxTries);
      params.append("sortBy", filters.sortBy);
      params.append("sortDir", filters.sortDir);
      params.append("page", pageNum);
      params.append("size", 10);

      // Обращаемся через прокси /api (убедитесь, что в vite.config.js настроен прокси)
      const response = await fetch(`/api/tasks/search?${params.toString()}`, {
         headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.content);
        setTotalPages(data.totalPages);
        setPage(data.number);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(page);
  }, [page]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    performSearch(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- ХЕЛПЕР ДЛЯ ОБРЕЗКИ ТЕКСТА ---
  const truncateText = (text, maxLength) => {
    if (!text) return <span className="text-muted fst-italic">No description</span>;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  // --------------------------------

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Advanced Task Search</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>

      {/* Форма фильтров (без изменений) */}
      <div className="card p-4 mb-4 shadow-sm">
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-12">
                <label className="form-label">Search by Task Name or Content</label>
                <input 
                    type="text" 
                    className="form-control" 
                    name="query" 
                    placeholder="e.g. array, integer, two sum" 
                    value={filters.query} 
                    onChange={handleInputChange} 
                />
                </div>
                {/* Остальные инпуты такие же, как были... */}
                <div className="col-md-3">
                    <label className="form-label">Date From</label>
                    <input type="date" className="form-control" name="dateFrom" value={filters.dateFrom} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Date To</label>
                    <input type="date" className="form-control" name="dateTo" value={filters.dateTo} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Min Tries</label>
                    <input type="number" className="form-control" name="minTries" value={filters.minTries} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Max Tries</label>
                    <input type="number" className="form-control" name="maxTries" value={filters.maxTries} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Sort By</label>
                    <select className="form-select" name="sortBy" value={filters.sortBy} onChange={handleInputChange}>
                        <option value="date">Date</option>
                        <option value="taskName">Name</option>
                        <option value="tryCounter">Attempts</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Direction</label>
                    <select className="form-select" name="sortDir" value={filters.sortDir} onChange={handleInputChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
                </div>
            </div>
        </form>
      </div>

      {/* --- ОБНОВЛЕННАЯ ТАБЛИЦА --- */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
            {results.length === 0 ? (
                <div className="alert alert-info text-center">No tasks found matching your criteria.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered bg-white" style={{tableLayout: "fixed"}}>
                        <thead className="table-light">
                            <tr>
                                <th style={{width: "20%"}}>Task Name</th>
                                <th style={{width: "45%"}}>Description Preview</th> {/* НОВАЯ КОЛОНКА */}
                                <th style={{width: "15%"}}>Date Solved</th>
                                <th style={{width: "10%"}}>Attempts</th>
                                <th style={{width: "10%"}}>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(task => (
                                <tr key={task.id}>
                                    <td style={{fontWeight: '500'}}>{task.taskName}</td>
                                    
                                    {/* Вывод контента с обрезкой до 100 символов */}
                                    <td style={{fontSize: "0.9rem", color: "#555"}} title={task.content}>
                                        {truncateText(task.content, 100)}
                                    </td>
                                    
                                    <td>{new Date(task.date).toLocaleDateString()}</td>
                                    <td>{task.tryCounter}</td>
                                    <td>
                                      {task.duration ? task.duration.replace("PT", "").toLowerCase() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3 gap-2">
                    <button 
                        className="btn btn-outline-primary" 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="align-self-center">Page {page + 1} of {totalPages}</span>
                    <button 
                        className="btn btn-outline-primary" 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </>
      )}
    </div>
  );
} 