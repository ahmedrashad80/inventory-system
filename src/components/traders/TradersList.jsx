import React, { useState, useEffect, useRef } from "react";
import { useTraders } from "../../hooks/useTraders";
import { Link } from "react-router-dom";

const TradersList = ({ refreshKey }) => {
  const { traders, fetchMore, hasMore, loading, fetchAllTraders } =
    useTraders();
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef();
  useEffect(() => {
    fetchAllTraders();
  }, [refreshKey]);
  // Filter traders by search term
  const filteredTraders = traders.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lazy load on scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >=
          containerRef.current.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        fetchMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchMore, hasMore, loading]);

  return (
    <div ref={containerRef}>
      <input
        type="text"
        placeholder="ابحث عن تاجر..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md p-2 border rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTraders.map((trader) => (
          <Link
            key={trader._id}
            to={`/traders/${trader._id}`}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-teal-100"
          >
            <h3 className="font-semibold text-lg">{trader.name}</h3>
            <p>الهاتف: {trader.phone || "-"}</p>
            <p>عدد الطلبات: {trader.totalOrders || 0}</p>
          </Link>
        ))}
      </div>
      {loading && <p className="text-center mt-4">جاري التحميل...</p>}
      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">لا مزيد من التجار</p>
      )}
    </div>
  );
};

export default TradersList;
