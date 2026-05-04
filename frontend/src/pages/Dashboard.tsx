export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <p>Current role: {role}</p>

      <a href="/verify">Бүтээгдэхүүн шалгах</a>
      <br />
      <a href="/create-product">Бүтээгдэхүүн бүртгэх</a>
    </div>
  );
}