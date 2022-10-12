import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Alerta from '../components/Alerta'


function NuevoPassword() {
    const params = useParams()

    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [alerta, setAlerta] = useState({})
    const [tokenValido, setTokenValido] = useState(false)
    const [passwordModificado, setPasswordModificado] = useState(false)

    const { token } = params

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/veterinarios/olvide-password/${token}`)
                setAlerta({
                    msg: 'Coloca tu nuevo password'
                })
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: 'Hubo un error con el enlace',
                    error: true
                })
            }
        }
        comprobarToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        if (password.length < 6) {
            setAlerta({
                msg: 'El password debe ser de minimo 6 caracteres',
                error: true
            })
            return
        }
        if (password !== repetirPassword) {
            setAlerta({
                msg: 'Las passwords no coinciden.',
                error: true
            })
            return
        }

        try {
            const url = `/veterinarios/olvide-password/${token}`
            const { data } = await clienteAxios.post(url, {
                password
            })

            console.log(data)

            setAlerta({
                msg: data.msg
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const { msg } = alerta

    return (
        <>
            <div>
                <h1 className="text-indigo-600 font-black text-6xl">Reestablece tu Password y no pierdas Acceso a {""} <span className="text-black"> tus Pacientes</span></h1>
            </div>
            <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
                {msg && <Alerta
                    alerta={alerta}
                />}
                {tokenValido && <>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="my-5">
                            <label className="uppercase text-gray-600 block text-xl font-bold"> Password </label>
                            <input
                                type="password"
                                placeholder="Tu nuevo password"
                                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label className="uppercase text-gray-600 block text-xl font-bold"> Repetir Password </label>
                            <input
                                type="password"
                                placeholder="Repite tu password"
                                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                value={repetirPassword}
                                onChange={e => setRepetirPassword(e.target.value)}
                            />
                        </div>
                        <input type="submit"
                            value="Guardar nuevo Password"
                            className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-600 md:w-auto"
                        />
                    </form>
                    {passwordModificado && <Link className='block text-center my-5 text-gray-500' to="/">¿Ya tienes una cuenta? Inicia Sesión</Link>}
                </>}

            </div>
        </>
    )
}

export default NuevoPassword