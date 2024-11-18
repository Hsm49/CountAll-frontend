import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/Estimaciones.css';

const Estimaciones: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      entradas_externas: { cantidad: '', parametro: '' },
      salidas_externas: { cantidad: '', parametro: '' },
      peticiones: { cantidad: '', parametro: '' },
      archivos_logicos: { cantidad: '', parametro: '' },
      archivos_interfaz: { cantidad: '', parametro: '' },
      respuestas: {
        r1: '', r2: '', r3: '', r4: '', r5: '', r6: '', r7: '', r8: '', r9: '', r10: '', r11: '', r12: '', r13: '', r14: ''
      },
      lenguaje: ''
    },
    validationSchema: Yup.object({
      entradas_externas: Yup.object({
        cantidad: Yup.number().required('Requerido'),
        parametro: Yup.string().oneOf(['Simple', 'Medio', 'Complejo']).required('Requerido')
      }),
      salidas_externas: Yup.object({
        cantidad: Yup.number().required('Requerido'),
        parametro: Yup.string().oneOf(['Simple', 'Medio', 'Complejo']).required('Requerido')
      }),
      peticiones: Yup.object({
        cantidad: Yup.number().required('Requerido'),
        parametro: Yup.string().oneOf(['Simple', 'Medio', 'Complejo']).required('Requerido')
      }),
      archivos_logicos: Yup.object({
        cantidad: Yup.number().required('Requerido'),
        parametro: Yup.string().oneOf(['Simple', 'Medio', 'Complejo']).required('Requerido')
      }),
      archivos_interfaz: Yup.object({
        cantidad: Yup.number().required('Requerido'),
        parametro: Yup.string().oneOf(['Simple', 'Medio', 'Complejo']).required('Requerido')
      }),
      respuestas: Yup.object().shape({
        r1: Yup.number().required('Requerido'),
        r2: Yup.number().required('Requerido'),
        r3: Yup.number().required('Requerido'),
        r4: Yup.number().required('Requerido'),
        r5: Yup.number().required('Requerido'),
        r6: Yup.number().required('Requerido'),
        r7: Yup.number().required('Requerido'),
        r8: Yup.number().required('Requerido'),
        r9: Yup.number().required('Requerido'),
        r10: Yup.number().required('Requerido'),
        r11: Yup.number().required('Requerido'),
        r12: Yup.number().required('Requerido'),
        r13: Yup.number().required('Requerido'),
        r14: Yup.number().required('Requerido')
      }),
      lenguaje: Yup.string().required('Requerido')
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4444/api/estimacion/realizarCOCOMO/:nombre_proyecto', values, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Estimación realizada',
          text: 'La estimación COCOMO se ha realizado exitosamente',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al realizar la estimación',
        });
      }
    }
  });

  const lenguajes = [
    'Access', 'Ada', 'APS', 'ASP 69', 'Ensamblador', 'C', 'C++', 'Clipper', 'COBOL', 'Cool:Gen/IEF', 'Culprit', 'DBase IV', 'Easytrieve+', 'Excel/47', 'Focus', 'FORTRAN', 'FoxPro', 'Ideal', 'IEF/Cool:Gen', 'Informix', 'Java', 'JavaScript', 'JCL', 'JSP', 'Lotus Notes', 'Mantis', 'Mapper', 'Natural', 'Oracle', 'PeopleSoft', 'Perl', 'PL/1', 'Powerbuilder', 'REXX', 'RPG II/III', 'SAS', 'Smalltalk', 'SQL', 'VBScript36', 'Visual Basic'
  ];

  return (
    <div className="estimaciones-container">
    <div className="chart-card">
      <h2>Realizar Estimación COCOMO</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Campos del formulario */}
        <div className="form-group">
          <label htmlFor="entradas_externas.cantidad">Entradas Externas - Cantidad</label>
          <input
            type="number"
            id="entradas_externas.cantidad"
            {...formik.getFieldProps('entradas_externas.cantidad')}
          />
          {formik.touched.entradas_externas?.cantidad && formik.errors.entradas_externas?.cantidad ? (
            <div className="error">{formik.errors.entradas_externas.cantidad}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="entradas_externas.parametro">Entradas Externas - Parámetro</label>
          <select id="entradas_externas.parametro" {...formik.getFieldProps('entradas_externas.parametro')}>
            <option value="">Seleccione</option>
            <option value="Simple">Simple</option>
            <option value="Medio">Medio</option>
            <option value="Complejo">Complejo</option>
          </select>
          {formik.touched.entradas_externas?.parametro && formik.errors.entradas_externas?.parametro ? (
            <div className="error">{formik.errors.entradas_externas.parametro}</div>
          ) : null}
        </div>
        {/* Repite los campos anteriores para salidas_externas, peticiones, archivos_logicos, archivos_interfaz */}
        {/* Campos para respuestas */}
        {Array.from({ length: 14 }, (_, i) => (
          <div className="form-group" key={i}>
            <label htmlFor={`respuestas.r${i + 1}`}>Respuesta {i + 1}</label>
            <input
              type="number"
              id={`respuestas.r${i + 1}`}
              {...formik.getFieldProps(`respuestas.r${i + 1}`)}
            />
            {formik.touched.respuestas?.[`r${i + 1}` as keyof typeof formik.touched.respuestas] && formik.errors.respuestas?.[`r${i + 1}` as keyof typeof formik.errors.respuestas] ? (
              <div className="error">{formik.errors.respuestas[`r${i + 1}` as keyof typeof formik.errors.respuestas]}</div>
            ) : null}
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="lenguaje">Lenguaje Predominante</label>
          <select id="lenguaje" {...formik.getFieldProps('lenguaje')}>
            <option value="">Seleccione</option>
            {lenguajes.map((lenguaje) => (
              <option key={lenguaje} value={lenguaje}>{lenguaje}</option>
            ))}
          </select>
          {formik.touched.lenguaje && formik.errors.lenguaje ? (
            <div className="error">{formik.errors.lenguaje}</div>
          ) : null}
        </div>
        <button type="submit" className="btn-azul">Realizar Estimación</button>
      </form>
      </div>
    </div>
  );
};

export default Estimaciones;