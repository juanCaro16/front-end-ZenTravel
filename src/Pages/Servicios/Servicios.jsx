export const Servicios = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-white">
        <div className="grid grid-cols-2 gap-8 text-center mb-8 w-[80%]">
          {/* Seguridad */}
          <div>
            <h2 className="text-xl font-bold mb-2">Seguridad</h2>
            <p className="text-sm text-justify mx-auto w-[15rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
            </p>
          </div>
  
          {/* Precios Bajos */}
          <div>
            <h2 className="text-xl font-bold mb-2">Precios Bajos</h2>
            <p className="text-sm text-justify mx-auto w-[15rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
            </p>
          </div>
  
          {/* Excelentes Paquetes Familiares */}
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-2 text-[#F0FA39]">Excelentes Paquetes Familiares</h2>
            <p className="text-sm text-justify mx-auto w-[30rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
            </p>
          </div>
  
          {/* Realidad Aumentada */}
          <div>
            <h2 className="text-xl font-bold mb-2">Realidad aumentada</h2>
            <p className="text-sm text-justify mx-auto w-[15rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
            </p>
          </div>
  
          {/* Implementación de IA */}
          <div>
            <h2 className="text-xl font-bold mb-2">Implementación de IA</h2>
            <p className="text-sm text-justify mx-auto w-[15rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
            </p>
          </div>
        </div>
  
        {/* Botón de registro */}
        <button className="bg-[#F0FA39] text-black font-bold py-2 px-6 rounded-full hover:bg-[#D4E02E]">
          REGÍSTRATE AHORA
        </button>
      </div>
    );
  };