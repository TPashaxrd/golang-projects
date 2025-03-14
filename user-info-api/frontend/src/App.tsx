import { useEffect, useState } from "react";

const GreetUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [currencyAge, setCurrencyAge] = useState<number | "">("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [email, setEmail] = useState<string>("");


  let name = "Toprak";
  let githubLink = "https://github.com/TPashaxrd";

  document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key === "Unidentified") {
      return;
    }
      if (event.key === "Enter") {
      return;
    } 
  
    if (event.key === "Escape") {
      console.log("Escape tuşuna basıldı");
    }
      if (event.ctrlKey && event.key === "a") {
        localStorage.clear()
    }
  });
  

  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await fetch("https://freeipapi.com/api/json");
        const data = await response.json();
        if (data.ipAddress) {
          setIpAddress(data.ipAddress);
          setCountry(data.countryName.toUpperCase());
          setCity(data.cityName.toUpperCase());
          console.log("IP Alındı:", data.ipAddress, "Ülke:", data.countryName);
        } else {
          console.warn("IP API'den boş döndü.");
        }
      } catch (error) {
        console.error("IP Alınırken Hata:", error);
      }
    };

    getIp();
  }, []);

  const handleGreet = async () => {
    if (!firstName || !lastName || !currencyAge || !gender || !ipAddress) {
      setGreeting("Lütfen tüm inputları doldurun..");
      return;
    }
    try {
      if (localStorage.getItem('block') === 'true') {
        setGreeting("Form zaten gönderildi. Bir daha gönderemezsiniz.");
        return;
      }

      console.log("İstek yapılıyor...");
      const url = `http://localhost:8080/users?first_name=${firstName}&last_name=${lastName}&email=${email}&age=${currencyAge}&gender=${gender}&ip_address=${ipAddress}&country=${country}&city_name=${city}`;
      console.log("URL:", url);

      const userResponse = await fetch(url);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setGreeting(
          `Merhaba, ${userData.first_name} ${userData.last_name}, ${userData.email} ,${userData.age}! ${userData.gender} IP: ${userData.ip_address} ${userData.country} ${city}`
        );
        console.log("Başarılı bir şekilde API'den veri alındı.");
        localStorage.setItem('block', 'true');
      } else {
        setGreeting("Bir hata oluştu.");
        console.error("HTTP Hatası:", userResponse.status);
      }
    } catch (error) {
      setGreeting("Bir hata oluştu.");
      console.error("Fetch hatası:", error);
    }
  };

  const handleCopyIP = () => {
    if (ipAddress) {
      navigator.clipboard.writeText(ipAddress);
      console.log("IP Kopyalandı:", ipAddress);
    }
  };

  return (
    <div className="flex flex-col w-full h-full placeholder:bg-gray-300">
      <h2>
        Created by {name},{" "}
        <a className="text-red-500 hover:text-red-700 hover:underline" href={githubLink}>
          Github?
        </a>
      </h2>
      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setGender("Male")}
          className={`w-1/2 p-2 rounded-md ${gender === "Male" ? "bg-blue-700 text-white" : "bg-gray-300"}`}
        >
          Male
        </button>
        <button
          onClick={() => setGender("Female")}
          className={`w-1/2 p-2 rounded-md ${gender === "Female" ? "bg-pink-700 text-white" : "bg-gray-300"}`}
        >
          Female
        </button>
      </div>
      <input type="mail" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email} />
      <div className="flex gap-2 mt-2">
        <input type="text" placeholder="Your Country" value={country} disabled />
        <input type="text" onClick={handleCopyIP} className="cursor-pointer" value={ipAddress || "IP Alınıyor..."} disabled />
        <input type="text" value={city} disabled />
      </div>

      <input
        type="number"
        min={10}
        max={65}
        placeholder="Age"
        value={currencyAge}
        onChange={(e) => setCurrencyAge(e.target.value ? Number(e.target.value) : "")}
      />
      <br />
      <button onClick={handleGreet} disabled={!ipAddress}>
        {ipAddress ? "Greet" : "IP Bekleniyor..."}
      </button>
      {greeting && <p>{greeting}</p>}
    </div>
  );
};

export default GreetUser;
