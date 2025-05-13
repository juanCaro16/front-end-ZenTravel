import { useNavigate } from "react-router-dom"


export const Main = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full flex pl-20 flex-col justify-center items-start mt-30 gap-8">
        <h2 className="text-black text-6xl font-black">ZenTravel</h2>
        <p className="text-black w-[40rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, autem. Fuga sequi saepe minus pariatur earum commodi quaerat praesentium ea dignissimos facere nulla reprehenderit hic assumenda aut facilis, aspernatur dicta.</p>
        <button onClick={() => navigate("/servicios")} className="bg-[#28A745] hover:bg-[#218838] cursor-pointer  rounded-4xl w-40 h-10 font-bold ml-15">Descúbrelo</button>
     </div>
    </>
  )
}
