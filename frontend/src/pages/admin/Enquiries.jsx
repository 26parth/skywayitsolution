import { useAdminEnquiries, useDeleteEnquiry } from "../../hooks/adminEnquiryFeedback";

export default function Enquiries() {
 const { data = [], isLoading } = useAdminEnquiries();

  const del = useDeleteEnquiry();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Enquiries</h2>
      {data.map((e) => (
        <div key={e._id} style={{ borderBottom: "1px solid #ccc" }}>
          <p><b>{e.name}</b> ({e.email})</p>
          <p>{e.message}</p>
          <button onClick={() => del.mutate(e._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
