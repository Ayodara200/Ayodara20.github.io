import {useState, useEffect} from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, } from 'react-leaflet'
import Markerposition from "./Markerposition"
import arrow from "./images/icon-arrow.svg"
import background from "./images/pattern-bg-desktop.png"

 function AppEntry() {
const [address, setAddress] = useState(null)
const [ipAddress, setIpAddress] = useState("")
const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/

useEffect(() => {
  try {
    const getInitialData = async () => {
      const res = await fetch (`https://geo.ipify.org/api/v2/country,city?apiKey=at_OKnAG024YBBEC4ohmg01MSSfQegFq&ipAddress=8.8.8.8`)
      const data = await res.json()
      setAddress(data)
       console.log(data)

    }

    getInitialData()

  } catch (error) {
    console.trace(error)
  }
}, [])

async function getEnteredAddress (){
    const res = await fetch (`https://geo.ipify.org/api/v2/country,city?apiKey=at_OKnAG024YBBEC4ohmg01MSSfQegFq&${ 
      checkIpAddress.test(ipAddress) ? `ipAddress=${ipAddress}` : 
      checkDomain.test(ipAddress) ? `domain=${ipAddress}` : ""
    }`)
    const data = await res.json()
    setAddress(data)
}

function handleSubmit(e) {
  e.preventDefault()
  getEnteredAddress ()
  setIpAddress("")
}
function getAddressString(address) {
  if (address && address.location && address.location.city && address.location.region) {
    return `${address.location.city}, ${address.location.region}`;
  }
  
  return 'Roosevelt, Washington';
}

function getTimezoneString(address) {
  if (address && address.location && address.location.timezone) {
    return address.location.timezone;
  }
  
  return ' -07:00';
}

function getIPString(address) {
  if (address && address.ip) {
    return address.ip;
  }
  
  return '192.712.134.806';
}

function getISPString(address) {
  if (address && address.isp) {
    return address.isp;
  }
  
  return 'Southern California Edison';
}
function getCoordinates(address) {
  if (address && address.location && Array.isArray(address.location.lat) && Array.isArray(address.location.lng)) {
    return [address.location.lat[0], address.location.lng[0]];
  }

  return [51.505, -0.09];
}
const coordinates = getCoordinates(address);

  return (
    <>

    <section className='overflow-hidden  '>
      <div className="absolute w-full -z-10 m-0">
        <img src={background} alt="" className=" w-full h-70 object-cover "/>
      </div>
      <article className="p-8 ">
        <h1 className="text-2xl text-center text-white font-bold mb-8 lg:text-3xl">IP Address Tracker</h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex justify-center max-w-xl mx-auto">
          <input type="text" name = "ipaddress"
          id="ipaddress" placeholder="Search for any IP Address or domain" required 
          className="py-2 px-4 rounded-l-lg w-full"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          />
          <button type="submit" className="bg-black py-4 px-4 hover:opacity-60
          rounded-r-lg">
            <img src={arrow}/>
          </button>
        </form>

      </article>
      
      {address && <> <article className="bg-white rounded-lg shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4
      max-w-6xl xl:mx-auto text-center md:text-left lg: -mb-16 relative "style={{zIndex: 10000}} >

      <div className="lg:border-r lg:border-slate-400 ">
        <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Ip Address</h2>
        <p className="font-semibold text-slate-900   md:text-xl xl:text-2xl">{getIPString(address)} </p>
      </div>
      <div className="lg:border-r lg:border-slate-400 ">
        <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Location</h2>
        <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl"> {getAddressString(address)} </p>
      </div>
      <div className="lg:border-r lg:border-slate-400 ">
        <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Timezone</h2>
        <p className="font-semibold text-slate-900   md:text-xl xl:text-2xl">UTC {getTimezoneString(address)}</p>
      </div>
      <div >
        <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">ISP</h2>
        <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">{getISPString(address)}</p>
      </div>

        </article>
        <MapContainer className="Map-cont" center={coordinates} zoom={13} scrollWheelZoom={true}  style={{height: "58.4vh", width: "100vw", marginTop:"-100px"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <Markerposition address={address} />
  </MapContainer>
</>}
      
    </section>

    </>
  );
}

export default AppEntry;
