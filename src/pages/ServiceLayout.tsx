import { Outlet } from 'react-router-dom'

const ServiceLayout = () => {
  return (
    <div className="container mx-auto py-6">
      <Outlet />
    </div>
  )
}

export default ServiceLayout