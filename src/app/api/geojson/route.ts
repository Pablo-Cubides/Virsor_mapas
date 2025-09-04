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
    const date = url.searchParams.get('date')

    if (!datasetId || !date) {
      return NextResponse.json({ 
        error: 'datasetId y date son requeridos' 
      }, { status: 400 })
    }

    // Get GeoJSON data for specific dataset and date from storage
    const fileName = `${datasetId}/${date}.geojson`
    
    const { data, error } = await supabase.storage
      .from('datasets')
      .download(fileName)

    if (error) {
      console.error('Error downloading GeoJSON:', error)
      return NextResponse.json({ error: 'Datos no encontrados' }, { status: 404 })
    }

    const text = await data.text()
    const geojson = JSON.parse(text)

    return NextResponse.json(geojson)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase no configurado. Configure las variables de entorno.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { datasetId, date, geojson } = body

    if (!datasetId || !date || !geojson) {
      return NextResponse.json({ 
        error: 'datasetId, date y geojson son requeridos' 
      }, { status: 400 })
    }

    // Save GeoJSON data to storage
    const fileName = `${datasetId}/${date}.geojson`
    const fileData = JSON.stringify(geojson)

    const { error: uploadError } = await supabase.storage
      .from('datasets')
      .upload(fileName, fileData, {
        contentType: 'application/json',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading GeoJSON:', uploadError)
      return NextResponse.json({ error: 'Error al guardar los datos' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
