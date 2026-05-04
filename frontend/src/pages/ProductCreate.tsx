import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

export default function ProductCreate() {
  const [productCode, setProductCode] = useState("MEAT-001");
  const [name, setName] = useState("Үхрийн мах");
  const [animalType, setAnimalType] = useState("Үхэр");
  const [originLocation, setOriginLocation] = useState("Архангай аймаг");
  const [result, setResult] = useState<string | null>(null);

  const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await API.post("/products/", {
        product_code: productCode,
        name,
        animal_type: animalType,
        origin_location: originLocation,
      });

      setResult(`Бүтээгдэхүүн амжилттай үүслээ: ${res.data.product.qr_code}`);
    } catch (error: any) {
      console.error(error);
      setResult(error.response?.data?.detail ?? "Алдаа гарлаа");
    }
  };

  return (
    <>
      <Navbar />

      <main className="page narrow-page">
        <div className="section-title">
          <span className="eyebrow">Product module</span>
          <h2>Бүтээгдэхүүн бүртгэх</h2>
          <p>Admin/Farmer role-той хэрэглэгч бүтээгдэхүүн бүртгэнэ.</p>
        </div>

        <form className="panel form" onSubmit={createProduct}>
          <label>
            Product code
            <input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="MEAT-001"
            />
          </label>

          <label>
            Product name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Үхрийн мах"
            />
          </label>

          <label>
            Animal type
            <input
              value={animalType}
              onChange={(e) => setAnimalType(e.target.value)}
              placeholder="Үхэр"
            />
          </label>

          <label>
            Origin location
            <input
              value={originLocation}
              onChange={(e) => setOriginLocation(e.target.value)}
              placeholder="Архангай аймаг"
            />
          </label>

          <button className="btn btn-full">Create product</button>

          {result && <div className="result-box">{result}</div>}
        </form>
      </main>
    </>
  );
}