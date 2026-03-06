import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, MoreVertical, X, ChevronLeft, ChevronRight, Star, TrendingUp, Package, Zap } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface RecomendadorSimiProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableVideo?: boolean;
}

interface Producto {
  nombre: string;
  categoria: string;
  descuento: string;
  motivo: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export const RecomendadorSimiModule: React.FC<RecomendadorSimiProps> = ({
  videoStreamUrl,
  apiEndpoint,
  enableVideo = false,
}) => {
  const { colores } = brandingConfig;

  const [stockStatus, setStockStatus] = useState<'disponible' | 'agotando' | 'agotado'>('disponible');
  const [productosPendientes, setProductosPendientes] = useState(7);
  const [ahorro, setAhorro] = useState(1240);
  const [satisfaccionScore, setSatisfaccionScore] = useState(4.9);

  const [showMenu, setShowMenu] = useState(false);
  const [showPedido, setShowPedido] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmedPedido, setConfirmedPedido] = useState<{ date: string; time: string } | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [selectedProductos, setSelectedProductos] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);

  // Frases promocionales rotativas
  const promoIdeas = [
    '🔥 ¡Ofertas que no puedes perder!',
    '💊 Stock limitado disponible',
    '⭐ Lo más vendido esta semana',
    '💰 Ahorra más comprando hoy',
    '📦 Pedido inteligente activo',
    '🛒 Recomendaciones personalizadas',
    '✅ Surtido óptimo garantizado',
  ];

  // Productos recomendados con IA
  const productosRecomendados: Producto[] = [
    { nombre: 'Paracetamol 500mg c/20', categoria: 'Analgésicos', descuento: '15%', motivo: 'Alta rotación esta semana', prioridad: 'alta' },
    { nombre: 'Omeprazol 20mg c/14', categoria: 'Gastro', descuento: '10%', motivo: 'Stock bajo en tu zona', prioridad: 'alta' },
    { nombre: 'Vitamina C 1g c/10', categoria: 'Vitaminas', descuento: '20%', motivo: 'Temporada de resfriados', prioridad: 'media' },
    { nombre: 'Ibuprofeno 400mg c/20', categoria: 'Analgésicos', descuento: '12%', motivo: 'Promoción exclusiva Simi', prioridad: 'media' },
    { nombre: 'Metformina 850mg c/30', categoria: 'Diabetes', descuento: '8%', motivo: 'Producto frecuente', prioridad: 'baja' },
  ];

  const prioridadColor: Record<string, string> = {
    alta: '#EF4444',
    media: '#F59E0B',
    baja: '#10B981',
  };

  // Rotación de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoIdeas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Calendario
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(selected)) setSelectedDate(selected);
  };

  const handlePedidoConfirm = () => {
    if (selectedDate && selectedTime) {
      setConfirmedPedido({
        date: selectedDate.toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: selectedTime,
      });
      setShowPedido(false);
      setShowConfirmation(true);
      setSelectedDate(null);
      setSelectedTime('');
      setShowMenu(false);
    }
  };

  const toggleProducto = (nombre: string) => {
    setSelectedProductos((prev) =>
      prev.includes(nombre) ? prev.filter((p) => p !== nombre) : [...prev, nombre]
    );
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div
      style={{
        backgroundColor: colores.fondoSecundario,
        borderRadius: '24px',
        border: `1px solid ${colores.borde}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              Simi Promo
            </h3>
            <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0 }}>
              Recomendador de Compras IA
            </p>
          </div>
        </div>

        {/* Menú */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: colores.fondoSecundario,
                border: `1px solid ${colores.borde}`,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Programar Pedido a Tienda', action: () => { setShowPedido(true); setShowMenu(false); } },
                { label: 'Más Información', action: () => { setShowInfo(true); setShowMenu(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: colores.textoClaro,
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Área principal - Video o contenido */}
      <div
        style={{
          flex: 1,
          backgroundColor: colores.fondoTerciario,
          borderRadius: '16px',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {enableVideo ? (
          <video
            src={videoStreamUrl || '/assets/simiVideo2.mp4'}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              const container = video.parentElement;
              if (container) {
                container.innerHTML = `
                  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:${colores.textoMedio};">
                    <p style="font-size:14px;">Video no disponible</p>
                  </div>`;
              }
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ShoppingBag size={28} color="white" />
              </div>
              <p style={{ color: colores.textoClaro, fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                SIMI PROMO
              </p>
              <p style={{ color: colores.textoMedio, fontSize: '12px' }}>Recomendador de Compras IA</p>
            </div>
          </div>
        )}

        {/* Frase rotativa */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '16px',
            maxWidth: '200px',
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '10px 16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.5s ease',
          }}
        >
          <p
            style={{
              color: '#FFFFFF',
              fontSize: '11px',
              lineHeight: '1.4',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {promoIdeas[currentPromoIndex]}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
            {promoIdeas.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: index === currentPromoIndex ? '#F59E0B' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Badge de estado */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: stockStatus === 'disponible' ? '#10B981' : stockStatus === 'agotando' ? '#F59E0B' : '#EF4444',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {stockStatus === 'disponible' ? 'Activo' : stockStatus === 'agotando' ? 'Stock Bajo' : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Botón de acción rápida */}
        <button
          onClick={() => setShowPedido(true)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          }}
          title="Pedir a tienda"
        >
          <Package size={20} />
        </button>
      </div>

      {/* Productos recomendados */}
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <TrendingUp size={14} color={colores.textoMedio} />
          <p style={{ fontSize: '12px', fontWeight: '600', color: colores.textoMedio, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recomendados para ti hoy
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {productosRecomendados.slice(0, 3).map((prod) => (
            <div
              key={prod.nombre}
              onClick={() => toggleProducto(prod.nombre)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: selectedProductos.includes(prod.nombre) ? `${colores.primario}20` : colores.fondoTerciario,
                border: `1px solid ${selectedProductos.includes(prod.nombre) ? colores.primario : colores.borde}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: prioridadColor[prod.prioridad],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: colores.textoClaro, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prod.nombre}
                  </p>
                  <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '2px 0 0 0' }}>
                    {prod.motivo}
                  </p>
                </div>
              </div>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#10B98120',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>-{prod.descuento}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedProductos.length > 0 && (
          <button
            onClick={() => setShowPedido(true)}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Zap size={14} />
            Solicitar {selectedProductos.length} producto{selectedProductos.length > 1 ? 's' : ''} a tienda
          </button>
        )}
      </div>

      {/* Métricas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '16px',
          backgroundColor: colores.fondoTerciario,
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>{productosPendientes}</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Recomendados</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>${ahorro}</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Ahorro Potencial</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444', margin: 0 }}>{satisfaccionScore}★</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Precisión IA</p>
        </div>
      </div>

      {/* Modal de Pedido / Calendario */}
      {showPedido && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowPedido(false)}
        >
          <div
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
                Programar Pedido
              </h3>
              <button onClick={() => setShowPedido(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}>
                <X size={24} />
              </button>
            </div>

            {/* Lista de productos seleccionados */}
            {selectedProductos.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: colores.fondoTerciario, borderRadius: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: colores.textoMedio, marginBottom: '8px' }}>
                  Productos seleccionados:
                </p>
                {selectedProductos.map((p) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '13px', color: colores.textoClaro }}>{p}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navegación del mes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoClaro }}>
                <ChevronLeft size={24} />
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', color: colores.textoClaro }}>
                {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoClaro }}>
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Calendario */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colores.textoMedio }}>
                    {day}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                  const days = [];
                  for (let i = 0; i < startingDayOfWeek; i++) days.push(<div key={`e-${i}`} />);
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isDisabled = isDateDisabled(date);
                    const isSelected = selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentMonth.getMonth() &&
                      selectedDate?.getFullYear() === currentMonth.getFullYear();
                    days.push(
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isSelected ? '#F59E0B' : 'transparent',
                          color: isDisabled ? colores.textoMedio : isSelected ? 'white' : colores.textoClaro,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          opacity: isDisabled ? 0.4 : 1,
                        }}
                      >
                        {day}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>

            {/* Horario */}
            {selectedDate && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: colores.textoClaro, marginBottom: '12px' }}>
                  Selecciona una hora de entrega:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: `1px solid ${colores.borde}`,
                        backgroundColor: selectedTime === time ? '#F59E0B' : 'transparent',
                        color: selectedTime === time ? 'white' : colores.textoClaro,
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePedidoConfirm}
              disabled={!selectedDate || !selectedTime}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: (!selectedDate || !selectedTime)
                  ? colores.textoMedio
                  : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
                opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
              }}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Información */}
      {showInfo && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowInfo(false)}
        >
          <div
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
                Acerca de Simi Promo
              </h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: colores.fondoTerciario, borderRadius: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '60px', height: '60px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <ShoppingBag size={32} color="white" />
              </div>

              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>Simi Promo</strong> es tu asistente inteligente de compras, diseñado para optimizar el surtido de tu tienda Similares.
              </p>

              <p style={{ fontSize: '13px', color: colores.textoMedio, lineHeight: '1.6', marginBottom: '12px' }}>
                Analiza tendencias de ventas, stock disponible y promociones activas para recomendarte qué conviene pedir hoy.
              </p>

              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px', marginTop: '12px' }}>
                {[
                  'Recomendaciones personalizadas por zona',
                  'Alertas de productos en oferta',
                  'Programación de pedidos inteligente',
                  'Maximiza tu ahorro con descuentos Simi',
                ].map((item) => (
                  <p key={item} style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                    <strong style={{ color: colores.textoClaro }}>✓</strong> {item}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmation && confirmedPedido && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setShowConfirmation(false)}
        >
          <div
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colores.textoClaro, margin: '0 0 12px 0' }}>
              ¡Pedido Programado!
            </h3>

            <p style={{ fontSize: '14px', color: colores.textoMedio, marginBottom: '24px', lineHeight: '1.5' }}>
              Tu pedido ha sido confirmado y será surtido por la tienda Similares
            </p>

            <div
              style={{
                backgroundColor: colores.fondoTerciario,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: `1px solid ${colores.borde}`,
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de entrega</p>
                <p style={{ fontSize: '15px', color: colores.textoClaro, margin: 0, fontWeight: '600' }}>{confirmedPedido.date}</p>
              </div>
              <div style={{ height: '1px', backgroundColor: colores.borde, margin: '12px 0' }} />
              <div>
                <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora</p>
                <p style={{ fontSize: '15px', color: colores.textoClaro, margin: 0, fontWeight: '600' }}>{confirmedPedido.time}</p>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '20px', lineHeight: '1.5' }}>
              Recibirás una notificación cuando tu pedido esté listo para recoger
            </p>

            <button
              onClick={() => setShowConfirmation(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ¡Perfecto, gracias!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};