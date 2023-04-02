import { log } from 'next-axiom'

const Fallback = ({ error, componentStack, resetError }) => {

    log.error('fallback error', {
        error,
        componentStack,
    })

    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <h1 className="text-2xl font-medium mb-4">Oops, there is an error!</h1>

            <button
                type="button"
                className='bg-green-800 text-white rounded-md px-4 py-2'
                onClick={() => resetError()}
            >
                Try again?
            </button>
        </div>
    )
}

export default Fallback