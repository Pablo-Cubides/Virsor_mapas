import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase no configurado. Configure las variables de entorno.' 
      }, { status: 503 })
    }

    const url = new URL(request.url)
    const datasetId = url.searchParams.get('datasetId')

    if (!datasetId) {
      return NextResponse.json({ 
        error: 'datasetId es requerido' 
      }, { status: 400 })
    }

    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('available_dates')
      .eq('id', datasetId)
      .single()

    if (error || !dataset) {
      console.error('Error fetching dataset:', error)
      return NextResponse.json({ error: 'Dataset no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ dates: dataset.available_dates })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
