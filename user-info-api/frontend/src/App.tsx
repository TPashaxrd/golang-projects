import { useState } from "react";

const GreetUser = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");
  const [currencyAge, setCurrencyAge] = useState<number>(0);

  document.addEventListener('keydown', (event) => {
    if (event.isComposing || event.key === "Unidentified") {
      return;
    }
    if (event.key === "Enter") {
      handleGreet();
    }
  }) // Enter tuşuna basıldığında handleGreet fonksiyonunu çalıştırır.

  const handleGreet = async () => {
    console.log("İstek yapılıyor...");
    const url = `http://localhost:8080/users?first_name=${firstName}&last_name=${lastName}&age=${currencyAge}`;
    console.log("URL:", url);

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setGreeting(`Merhaba, ${data.first_name} ${data.last_name}, ${data.age}!`);
        console.log("Başarılı bir şekilde API'den veri alındı.");
      } else {
        setGreeting("Bir hata oluştu.");
        console.error("Bir hata oluştu, HTTP yanıtı:", response.status);
      }
      if (!firstName || !lastName || !currencyAge) {
        setGreeting("Lütfen tüm inputları doldurun..");
        return;
      }
    } catch (error) {
      setGreeting("Bir hata oluştu.");
      console.error("Fetch hatası:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full placeholder:bg-gray-300">
      <input
        className="placeholder:text-red-500 bg-gray-300 "
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={currencyAge}
        onChange={(e) => setCurrencyAge(parseInt(e.target.value))}
      />
      <br/>
      <button onClick={handleGreet}>Greet</button>
      {greeting && <p>{greeting}</p>}
    </div>
  );
};

export default GreetUser;

// Path: src/App.tsx
// Github: https://github.com/TPashaxrd/golang-project