"use client"

import { useState } from "react"
import { Package, Users, Calendar, MessageCircle, TrendingUp, CheckCircle } from "lucide-react"

export const EmployeePanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const employeeTabs = [
    { id: "dashboard", label: "Mi Dashboard", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "packages", label: "Paquetes", icon: <Package className="w-5 h-5" /> },
    { id: "customers", label: "Clientes", icon: <Users className="w-5 h-5" /> },
    { id: "reservations", label: "Reservas", icon: <Calendar className="w-5 h-5" /> },
    { id: "support", label: "Soporte", icon: <MessageCircle className="w-5 h-5" /> },
  ]

  const myStats = [
    { title: "Ventas del Mes", value: "12", icon: <Package className="w-5 h-5" />, color: "bg-blue-500" },
    { title: "Clientes Atendidos", value: "45", icon: <Users className="w-5 h-5" />, color: "bg-green-500" },
    { title: "Reservas Gestionadas", value: "28", icon: <Calendar className="w-5 h-5" />, color: "bg-purple-500" },
    { title: "Tickets Resueltos", value: "15", icon: <CheckCircle className="w-5 h-5" />, color: "bg-orange-500" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg text-white`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tareas Pendientes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
              <div className="space-y-3">
                {[
                  { task: "Confirmar reserva de Juan Pérez", priority: "Alta", time: "Vence en 2 horas" },
                  { task: "Actualizar paquete Cartagena", priority: "Media", time: "Vence mañana" },
                  { task: "Responder consulta de María", priority: "Baja", time: "Vence en 3 días" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.task}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.priority === "Alta"
                          ? "bg-red-100 text-red-800"
                          : item.priority === "Media"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "packages":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Paquetes</h3>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                Crear Paquete
              </button>
            </div>
            <p className="text-gray-600">Aquí puedes gestionar los paquetes turísticos...</p>
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {employeeTabs.find((tab) => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">Contenido de {activeTab} en desarrollo...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Empleado</h1>
          <p className="text-gray-600">Gestiona tus tareas y clientes</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {employeeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "border-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}
