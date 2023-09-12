import { ConfigProvider } from "antd";
import './App.css';
import { GlobalContext } from './components/context/GlobalContext';
import TablaContactos from "./components/ui/TablaContactos";
import { useState } from 'react';
import "dayjs/locale/es";
import dayjs from "dayjs";
import esES from "antd/lib/locale/es_ES";
dayjs.locale("es")

function App() {

  const [drawerNuevoContacto, setDrawerNuevoContacto] = useState(false);
  const [drawerEditarContacto, setDrawerEditarContacto] = useState(false);
  const [actualizarTableData, setActualizarTableData] = useState(false);

  return (
    <GlobalContext.Provider value={{ drawerNuevoContacto, setDrawerNuevoContacto, drawerEditarContacto, setDrawerEditarContacto, actualizarTableData, setActualizarTableData }}>
      <ConfigProvider
        locale={esES}
        theme={{
          token: {
            colorPrimary: "#56b43c",
          },
        }}
      >
        <TablaContactos />
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}

export default App;
