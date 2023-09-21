import React, { useEffect, useState, useContext } from 'react'
import { Select, Form } from "antd";
import {
  EditOutlined
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import './FiltroEtiqueta.css';
import { GlobalContext } from "../context/GlobalContext";


function FiltroEtiqueta({ modoEditarTags, contacto, etiquetasContacto, fetchEtiquetasxContactos, setTableData, dataContactos }) {

  const URL = process.env.REACT_APP_URL;
  const [dataEtiquetas, setDataEtiquetas] = useState();
  const [editarTags, setEditarTags] = useState(false);

  const { actualizarTableData, setActualizarTableData } = useContext(GlobalContext);

  useEffect(() => {

    const fetchDataEtiquetas = async () => {
      const data = await fetch(`${URL}buscarEtiquetasContacto.php`);
      const jsonData = await data.json();
      setDataEtiquetas(jsonData);
    }

    fetchDataEtiquetas()
      .catch(console.error);;

  }, []);

  const optionsEtiquetasContacto = dataEtiquetas?.map((etiqueta) => ({
    value: etiqueta.etq_id,
    label: etiqueta.etq_nombre,
    color: etiqueta.etq_color
  }));

  const handleEtiquetaChange = (selectedEtiquetas) => {
    console.log('Estoy en el handleEtiquetaChange')
    //Obtengo las etiquetas seleccionadas en el filtro.
    let selectedTags = [];
    for (const etiqueta of selectedEtiquetas) {
      selectedTags.push(etiqueta);
    }
    //Identifica que contactos cumplen con al menos una de las etiquetas seleccionadas.
    const contactosFiltrados = [];
    for (const contacto of dataContactos) {
      for (const tag of selectedTags) {
        if (contacto.etiquetasid?.includes(tag)) {
          contactosFiltrados.push(contacto);
        }
      }
    }
    //Limpia objetos repetidos, puede ocurrir con determinado orden de seleccion de tags en filtro.
    const result = contactosFiltrados.filter((item, index) => {
      return contactosFiltrados.indexOf(item) === index;
    })

    result.length > 0 ? setTableData(result) : setTableData(dataContactos);
  };

  const onchangeEditarTags = (etiquetas) => {
    console.log(etiquetas)
    let etq = [];
    const data = new FormData();
    data.append("idContacto", contacto.key);
    etiquetas.forEach((etiqueta) => {
      etq.push(Number(etiqueta));
    });
    //console.log(etq)
    data.append("etqC", JSON.stringify(etq));
    fetch(`${URL}guardarEtiquetaxContacto.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        // etq = [];
        // setActualizarEtiqueta(!actualizarEtiqueta);
        fetchEtiquetasxContactos(contacto.key);
        setActualizarTableData(!actualizarTableData);
      });
    });
  };

  const renderEtiquetaTag = (props) => {
    const { label, value, closable, onClose } = props;
    const etiqueta = dataEtiquetas?.find((etiqueta) => etiqueta.etq_id === value);
    const backgroundColor = etiqueta ? etiqueta.etq_color : "";
    return (
      <div
        className='etiqueta-general-style'
        style={{
          backgroundColor,
          marginRight: "8px" /*Espacio entre etiquetas */
        }}
      >
        <span style={{ paddingTop: "2px", fontWeight: "600" }}>
          {label?.toUpperCase()}
        </span>
        {closable && (
          <span
            style={{ marginLeft: "4px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            x
          </span>
        )}
      </div>
    );
  };


  return (
    <>
      {!modoEditarTags ?
        <Select
          showSearch
          mode="multiple"
          placeholder="Filtrar por etiquetas"
          options={optionsEtiquetasContacto}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase().trim())}
          onChange={modoEditarTags ? onchangeEditarTags : handleEtiquetaChange}
        />
        :
        <>
          <Form
            layout="vertical"
            //ref={formRef}
            //onFinish={editarContactoValues ? editarContacto : crearContacto}
            autoComplete="off"
            initialValues={contacto?.etiquetasid.length > 0 & contacto?.etiquetasid[0] !== null && contacto}
          >
            <div className='contenedor-drawer'>

              {editarTags ? <FormItem name="etiquetasid">
                <Select
                  showSearch
                  className='ant-select-selector-drawer'
                  mode="multiple"
                  placeholder="Seleccione etiquetas"
                  options={optionsEtiquetasContacto}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase().trim())}
                  onChange={onchangeEditarTags}
                  tagRender={renderEtiquetaTag} // Apariencia de etiquetas seleccionadas
                />
              </FormItem> :
                <div>
                  <div className="selected-tags">
                    {Array.isArray(etiquetasContacto) ? etiquetasContacto?.map((tag) => (
                      <div
                      className='etiqueta-general-style'
                        style={{
                          background: tag.etq_color
                        }}
                        key={tag.etq_id}
                      >
                        <span className="etiqueta-name">
                          {tag.etq_nombre.toUpperCase()}
                        </span>
                      </div>
                    )) : null}
                  </div>
                </div>
              }
              <EditOutlined className="icon-color" style={{ fontSize: '16px' }} onClick={() => setEditarTags(!editarTags)} />
            </div>

          </Form>

        </>

      }


    </>
  )
}

export default FiltroEtiqueta