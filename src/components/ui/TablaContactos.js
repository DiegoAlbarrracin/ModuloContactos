import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Drawer,
    Table,
    Modal,
    Divider,
    Row,
    Col,
    Input,
    App
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    CloseOutlined,
    SearchOutlined,
    MailOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MobileOutlined,
    UserOutlined,
    TagsOutlined,
    TeamOutlined,
    DeleteOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";
import dayjs from "dayjs";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./TablaContactos.css";
import { GlobalContext } from "../context/GlobalContext";
import FormContacto from "./FormContacto";
import FiltroEtiqueta from "./FiltroEtiqueta";
import Link from "antd/es/typography/Link";
import FormClientesAsoc from "./FormClientesAsoc";

function TablaContactos() {
    const { message } = App.useApp();
    const { modal } = App.useApp();
    // const { confirm } = Modal;


    const URL = process.env.REACT_APP_URL;
    const dateFormat = "DD/MM/YYYY";

    const { drawerNuevoContacto, setDrawerNuevoContacto, drawerEditarContacto, setDrawerEditarContacto, actualizarTableData } = useContext(GlobalContext);

    const [dataContactos, setDataContactos] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [contacto, setContacto] = useState(0);
    const [open, setOpen] = useState(false);
    const [openClientes, setOpenClientes] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [etiquetasContacto, setEtiquetasContacto] = useState('');
    const [dataClientesAsoc, setDataClientesAsoc] = useState([]);
   

    const [drawerEtiquetas, setDrawerEtiquetas] = useState(false);


    useEffect(() => {

        fetchDataContactos()
            .catch(console.error);;

    }, [actualizarTableData]);


    const fetchDataContactos = async () => {
        const data = await fetch(`${URL}con_masterEtiquetas.php`);
        const jsonData = await data.json();
        cargarTabla(jsonData);
        //console.log('RECARGUE TABLA CONTACTO')
    }

    const fetchEtiquetasxContactos = async (idContacto) => {
        const dataEtiquetaxContacto = await fetch(`${URL}modulo-contacto_etiquetaxcontacto.php?idContacto=${idContacto}`);
        const jsonDataExC = await dataEtiquetaxContacto.json();
        setEtiquetasContacto(jsonDataExC);
        //console.log(jsonDataExC)
    }

    const fetchDataClientesAsoc = async (idContacto) => {
        const data = await fetch(`${URL}modulo-contacto_clientesAsoc.php?idContacto=${idContacto}`);
        const jsonData = await data.json();
        setDataClientesAsoc(jsonData);
        console.log(jsonData)
    }

    const cargarTabla = (jsonData) => {

        const dataContactosMaped = jsonData.map((Contacto, index) => ({
            index: index,
            key: Contacto.con_id,
            nombre: Contacto.con_nombre,
            email: Contacto.con_email,
            telefono: Contacto.con_telefono,
            movil: Contacto.con_movil,
            fechaNac: Contacto.con_fechanac, //para tratamiento del dato fecha nacimiento
            fechaNacTable: <>{dayjs().diff((dayjs(Contacto.con_fechanac, dateFormat)), 'year')} <> ({Contacto.con_fechanac})</></>, //formateado para mostrar en tabla edad (fecha nacimiento)
            descripcion: Contacto.con_desc,
            etiquetas: Contacto.etq_nombre,
            etiquetasid: Contacto.etq_id,
            //propietario: Contacto.usu_nombre,
            //domicilio: Contacto.con_domicilio,
        }));
        setDataContactos(dataContactosMaped);
        setTableData(dataContactosMaped)
    };

    //Columnas Ant Design 
    const columns = [
        {
            title: "NOMBRE",
            //dataIndex: "nombre",
            key: "nombre",
            align: "left",
            sorter: {
                compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            onFilter: (value, record) => {
                return String(record.nombre).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.email).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.telefono).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.movil).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.fechaNac).toUpperCase().trim().includes(value.toUpperCase().trim());
            },
            filteredValue: [searchedText],
            render: (fila) => {
                return (
                    <>
                        <Link className="icon-color" onClick={() => seleccionarContacto(fila, 'verDetalle')}>{fila.nombre}</Link>
                    </>
                );
            },
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            align: "left",
            sorter: {
                compare: (a, b) => a.email.localeCompare(b.email),
            },
        },
        {
            title: "TELEFONO",
            dataIndex: "telefono",
            key: "telefono",
            align: "left"
        },
        {
            title: "MOVIL",
            dataIndex: "movil",
            key: "movil",
            align: "left"
        },
        // {
        //     title: "DOMICILIO",
        //     dataIndex: "domicilio",
        //     key: "domicilio",
        //     align: "left",
        //     sorter: {
        //         compare: (a, b) => a.domicilio?.localeCompare(b.domicilio),
        //     },
        // },
        {
            title: "EDAD",
            dataIndex: "fechaNacTable",
            key: "fechaNac",
            align: "center",
            sorter: {
                compare: (a, b) =>
                    dayjs(a.fechaNac, "DD-MM-YYYY") - dayjs(b.fechaNac, "DD-MM-YYYY"),
            },
        },
        {
            title: "...",
            key: "acciones",
            align: "center",
            render: (fila) => {
                return (
                    <>
                        <div className="btn-contenedor">
                            <EyeOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'verDetalle')} />
                            <EditOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'editar')} />
                            <TeamOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'clientesAsoc')} />
                            <TagsOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'etiqueta')} />
                        </div>
                    </>
                );
            },
        }
    ];


    const columnsTablaClientes = [
        {
            title: "CLIENTE",
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            sorter: {
                compare: (a, b) => a.cliente.localeCompare(b.cliente),
            },
            // render: (fila) => {
            //     return (
            //         <>
            //             <Link className="icon-color" onClick={() => seleccionarContacto(fila, 'verDetalle')}>{fila.nombre}</Link>
            //         </>
            //     );
            // },
        },
        {
            title: "ROL",
            dataIndex: "rol",
            key: "rol",
            align: "left",
            sorter: {
                compare: (a, b) => a.rol.localeCompare(b.rol),
            },
        },
        {
            title: "...",
            key: "acciones",
            align: "center",
            render: (fila) => {
                return (
                    <>
                        <div className="btn-contenedor">
                            <DeleteOutlined className="icon-color" onClick={() => eliminarRelacionCliCon(fila)} />
                        </div>
                    </>
                );
            },
        }
    ];

    const CustomCloseIcon = () => (
        <div className="drawer-close-icon">
            <CloseOutlined />
        </div>
    );

    //Asigna el valor de la fila al presionar editar
    const seleccionarContacto = (fila, accion) => {
        setContacto(fila);
        if (accion === 'editar') setDrawerEditarContacto(true);
        if (accion === 'verDetalle') {
            setOpen(true);
            fetchEtiquetasxContactos(fila.key);
        };
        if (accion == 'clientesAsoc') {
            setOpenClientes(true);
            fetchDataClientesAsoc(fila.key);
        };
        if (accion === 'etiqueta') {
            setDrawerEtiquetas(true);
            fetchEtiquetasxContactos(fila.key);
        };
    };


    const eliminarRelacionCliCon = (fila) => {
        console.log(fila)
        console.log(contacto)
        const tituloModal = `¿Desea desvincular el contacto ${contacto.nombre}, del cliente ${fila.cliente}?`;
        modal.confirm({
            title: tituloModal,
            icon: <ExclamationCircleFilled style={{ color: "red" }} />,
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            cancelButtonProps: {
                className: "cancel-button",
            },
            onOk() {
                const data = new FormData();
                data.append("idContacto", contacto.key);
                data.append("idCliente", fila.key);

                const requestOptions = {
                    method: 'POST',
                    body: data
                };
                fetchEliminarRelacion(requestOptions);
                console.log(contacto.key, fila.key)
            },
            onCancel() {
            },
        });
    };

    const fetchEliminarRelacion = async (requestOptions) => {
        const response = await fetch(`${URL}modulo-contacto_desvincularContacto.php`, requestOptions);
        console.log(response);
        await fetchDataClientesAsoc(contacto.key);
    };


    //Notificacion al copiar en modal 
    const showMessage = () => {
        message.success('Copiado!');
    };

    return (
        <>
            <Row className="div-boton">
                <Col xs={24} sm={24} md={12}>
                    <h3 className="titulo-modulo">CONTACTOS</h3>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <div className="buscador-btn-contenedor">
                        <FiltroEtiqueta setTableData={setTableData} dataContactos={dataContactos} />
                        <Input placeholder="Buscar..." className="buscador"
                            suffix={
                                <SearchOutlined className="search-icon" />
                            }
                            onChange={(e) => {
                                setSearchedText(e.target.value);
                            }}
                        />
                        <Button type="primary" className="btn-flat" onClick={() => setDrawerNuevoContacto(true)}>NUEVO CONTACTO</Button>
                    </div>
                </Col>
            </Row>


            <Table
                size={"small"}
                dataSource={tableData}
                columns={columns}
                pagination={{
                    position: ["none", "bottomRight"],
                    showSizeChanger: false
                }}
            />

            <Drawer
                title="Nuevo contacto"
                open={drawerNuevoContacto}
                onClose={() => setDrawerNuevoContacto(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormContacto />
            </Drawer>

            <Drawer
                title="Editar contacto"
                open={drawerEditarContacto}
                onClose={() => setDrawerEditarContacto(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormContacto editarContactoValues={contacto} />
            </Drawer>

            <Drawer
                title="Etiquetas"
                open={drawerEtiquetas}
                onClose={() => setDrawerEtiquetas(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FiltroEtiqueta modoEditarTags={true} contacto={contacto} dataContactos={dataContactos}
                    etiquetasContacto={etiquetasContacto} fetchEtiquetasxContactos={fetchEtiquetasxContactos} />
            </Drawer>

            <App>
                <Modal
                    title={
                        <div className="contenedor-titulo-modal">
                            <div className="contacto-modal"><UserOutlined /> {contacto.nombre}</div>
                        </div>
                    }

                    centered
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    width={600}
                    footer={[
                        <Button
                            key="btnAceptarModal"
                            type="primary"
                            onClick={() => setOpen(false)}
                            className="btn-flat"
                        >
                            Aceptar
                        </Button>,
                    ]}
                >
                    <Divider className="divider-style" />

                    <div className="body-modal">
                        <Row>
                            <Col xs={24} sm={24} md={24} className="card-col">

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

                            </Col>
                        </Row>

                        <Row className="card-row">
                            <Col xs={24} sm={12} md={6} className="card-col">

                                <MailOutlined className="icon-size" />
                                <div className="name-card">EMAIL</div>

                                <CopyToClipboard text={contacto.email} >
                                    <div className="data" onClick={showMessage} >{contacto.email}</div>
                                </CopyToClipboard>

                            </Col>
                            <Col xs={24} sm={12} md={6} className="card-col">

                                <CalendarOutlined className="icon-size" />
                                <div className="name-card">EDAD</div>
                                {contacto.fechaNac ?
                                    <CopyToClipboard text={contacto.fechaNac}>

                                        <div className="data" onClick={showMessage} >{dayjs().diff((dayjs(contacto.fechaNac, dateFormat)), 'year')} <div style={{ color: 'black', marginLeft: '8px' }}> ({contacto.fechaNac})</div></div>
                                    </CopyToClipboard> : ''}

                            </Col>

                        </Row>
                        <Divider className="divider-style" />
                        <Row className="card-row">
                            <Col xs={24} sm={12} md={6} className="card-col">

                                <PhoneOutlined className="icon-size" />
                                <div className="name-card">TELEFONO</div>
                                <CopyToClipboard text={contacto.telefono} >
                                    <div className="data" onClick={showMessage} >{contacto.telefono}</div>
                                </CopyToClipboard>

                            </Col>
                            <Col xs={24} sm={12} md={6} className="card-col">

                                <MobileOutlined className="icon-size" />
                                <div className="name-card">MOVIL</div>
                                <CopyToClipboard text={contacto.movil} >
                                    <div className="data" onClick={showMessage} >{contacto.movil}</div>
                                </CopyToClipboard>

                            </Col>

                        </Row>
                    </div>
                </Modal>



                <Modal
                    title={
                        <div className="contenedor-titulo-modal">
                            <div className="contacto-modal"><TeamOutlined /> CUENTAS ASOCIADAS AL CONTACTO</div>
                        </div>
                    }

                    centered
                    open={openClientes}
                    onOk={() => setOpenClientes(false)}
                    onCancel={() => setOpenClientes(false)}
                    destroyOnClose
                    width={600}
                    footer={[
                        <Button
                            key="btnAceptarModal"
                            type="primary"
                            onClick={() => setOpenClientes(false)}
                            className="btn-flat"
                        >
                            Cerrar
                        </Button>,
                    ]}
                >
                    <Divider className="divider-style" />

                    <div className="body-modal">
                        <Row>
                            <Col xs={24} sm={24} md={24}>

                                <FormClientesAsoc idContacto={contacto?.key} fetchDataClientesAsoc={fetchDataClientesAsoc} />

                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={24}>

                                <Table
                                    size={"small"}
                                    dataSource={dataClientesAsoc}
                                    columns={columnsTablaClientes}
                                    pagination={{
                                        position: ["none", "bottomRight"],
                                        showSizeChanger: false
                                    }}
                                />

                            </Col>
                            {/* <Col xs={24} sm={12} md={6} className="card-col">

                                <CalendarOutlined className="icon-size" />
                                <div className="name-card">EDAD</div>
                                {contacto.fechaNac ?
                                    <CopyToClipboard text={contacto.fechaNac}>

                                        <div className="data" onClick={showMessage} >{dayjs().diff((dayjs(contacto.fechaNac, dateFormat)), 'year')} <div style={{ color: 'black', marginLeft: '8px' }}> ({contacto.fechaNac})</div></div>
                                    </CopyToClipboard> : ''}

                            </Col> */}
                        </Row>

                    </div>
                </Modal>
            </App>

        </>
    )
}

// Exporto este componente envuelto en tags App de Ant design para poder hacer correcto uso del componente message.
export default () => (
    <App>
        <TablaContactos />
    </App>
);