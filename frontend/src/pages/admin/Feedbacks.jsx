import { useAdminFeedbacks, useDeleteFeedback } from "../../hooks/adminEnquiryFeedback";

export default function Feedbacks() {
 const { data = [], isLoading } = useAdminFeedbacks();

  const del = useDeleteFeedback();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Feedbacks</h2>
      {data.map((f) => (
        <div key={f._id} style={{ borderBottom: "1px solid #ccc" }}>
          <p><b>{f.name || "Anonymous"}</b> ({f.email || "N/A"})</p>
          <p>{f.feedback}</p>
          <button onClick={() => del.mutate(f._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
