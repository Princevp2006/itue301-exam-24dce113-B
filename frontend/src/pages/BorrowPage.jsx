import React, { useState, useEffect } from 'react';

const BorrowPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states matching controlled component requirements
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('borrowed');

  // Load data from backend on mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch borrowings
      const borrowingsRes = await fetch('http://localhost:5000/api/v1/borrowings');
      if (!borrowingsRes.ok) throw new Error('Failed to load borrowings');
      const borrowingsJson = await borrowingsRes.json();
      setBorrowings(borrowingsJson);

      // Fetch books
      const booksRes = await fetch('http://localhost:5000/api/v1/books');
      if (!booksRes.ok) throw new Error('Failed to load books catalog');
      const booksJson = await booksRes.json();
      setBooksList(booksJson);

      // Fetch members
      const membersRes = await fetch('http://localhost:5000/api/v1/members');
      if (!membersRes.ok) throw new Error('Failed to load members directory');
      const membersJson = await membersRes.json();
      setMembersList(membersJson);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while loading data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId || !borrowDate || !returnDate) {
      alert('Please select a member, a book, and borrow/return dates.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: selectedMemberId,
          bookId: selectedBookId,
          borrowDate,
          returnDate,
          status,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error?.message || 'Failed to save borrowing transaction.');
      }

      // Re-fetch populated records on success
      await loadData();

      // Reset form states
      setSelectedMemberId('');
      setSelectedBookId('');
      setBorrowDate('');
      setReturnDate('');
      setStatus('borrowed');
      setShowAddForm(false);
    } catch (err) {
      alert(`Error saving borrowing transaction: ${err.message}`);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'borrowed':
        return 'status-borrowed';
      case 'returned':
        return 'status-returned';
      case 'overdue':
        return 'status-overdue';
      default:
        return '';
    }
  };

  // Find preview names
  const previewMemberName = membersList.find(m => m._id === selectedMemberId)?.name || '';
  const previewBookTitle = booksList.find(b => b._id === selectedBookId)?.title || '';

  return (
    <div className="page-content borrow-page">
      <div className="page-header">
        <h2>Borrowing Records</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          {showAddForm ? 'Cancel' : 'New Borrow Entry'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <h3>New Borrowing Transaction</h3>

          {/* Real-time State display block */}
          <div className="form-preview" style={{
            backgroundColor: '#f1f5f9',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            borderLeft: '4px solid #4f46e5'
          }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#4f46e5' }}>Live Transaction Preview:</h4>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>
              <strong>Borrower Name:</strong> {previewMemberName || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(not selected)</span>}
            </p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>
              <strong>Book Title:</strong> {previewBookTitle || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(not selected)</span>}
            </p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>
              <strong>Borrow Date:</strong> {borrowDate || '---'} | <strong>Return Date:</strong> {returnDate || '---'}
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Select Member</label>
              <select 
                value={selectedMemberId} 
                onChange={(e) => setSelectedMemberId(e.target.value)} 
                required
              >
                <option value="">-- Choose Member --</option>
                {membersList.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.department})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Book</label>
              <select 
                value={selectedBookId} 
                onChange={(e) => setSelectedBookId(e.target.value)} 
                required
              >
                <option value="">-- Choose Book --</option>
                {booksList.map(b => (
                  <option key={b._id} value={b._id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Borrow Date</label>
              <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-submit">Save Transaction</button>
        </form>
      )}

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading borrowings ledger...
        </div>
      )}

      {error && (
        <div className="error-state" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="borrow-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Department</th>
                <th>Book Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No borrowings recorded.
                  </td>
                </tr>
              ) : (
                borrowings.map((b) => {
                  const mName = b.memberId && typeof b.memberId === 'object' ? b.memberId.name : 'Unknown';
                  const mDept = b.memberId && typeof b.memberId === 'object' ? b.memberId.department : 'Unknown';
                  const mIdVal = b.memberId && typeof b.memberId === 'object' ? b.memberId._id : b.memberId || 'N/A';
                  const bTitle = b.bookId && typeof b.bookId === 'object' ? b.bookId.title : 'Unknown';
                  const bDate = b.borrowDate ? b.borrowDate.split('T')[0] : '---';
                  const rDate = b.returnDate ? b.returnDate.split('T')[0] : '---';

                  return (
                    <tr key={b._id}>
                      <td><code>{mIdVal}</code></td>
                      <td><strong>{mName}</strong></td>
                      <td>{mDept}</td>
                      <td>{bTitle}</td>
                      <td>{bDate}</td>
                      <td>{rDate}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(b.status)}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;
