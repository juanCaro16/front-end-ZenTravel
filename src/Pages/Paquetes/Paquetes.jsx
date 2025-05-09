import img from "../../assets/Images/bg-image2.jpg";
export const Paquetes = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-col items-center gap-5 justify-center w-[25rem] h-max p-5 bg-white rounded-xl">
            <img className="w-[70%] h-[50%] rounded-xl" src={img}/>
            <h1>Santa Marta</h1>
            <p className="w-[90%]">Lorem ipsum dolor sit amet consectetur adipisi sunt! Nihil voluptate praesentium dolorem debitis animi aut quisquam eveniet error dicta enim? Et.</p>
            <button className="w-40 h-15 bg-[#28A745] rounded-3xl hover:bg-[#218838]">Comprar Paquete</button>            
        </div>
    </div>
    </>
  )
}


