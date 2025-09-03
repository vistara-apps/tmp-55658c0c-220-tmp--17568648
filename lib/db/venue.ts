import { supabase } from '../supabase';
import { Venue } from './types';
import { handleError } from './models';

// Get venue by ID
export async function getVenueById(id: string): Promise<Venue | null> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'venue', 'get');
    return null;
  }
}

// Create a new venue
export async function createVenue(venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>): Promise<Venue | null> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .insert({
        ...venue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'venue', 'create');
    return null;
  }
}

// Update a venue
export async function updateVenue(id: string, venue: Partial<Venue>): Promise<Venue | null> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .update({
        ...venue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'venue', 'update');
    return null;
  }
}

// Search venues by name or category
export async function searchVenues(query: string, limit: number = 20): Promise<Venue[]> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, 'venues', 'search');
    return [];
  }
}

// Get venues by category
export async function getVenuesByCategory(category: string, limit: number = 20): Promise<Venue[]> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .contains('categories', [category])
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, 'venues by category', 'get');
    return [];
  }
}

// Get venues near a location
export async function getVenuesNearLocation(
  latitude: number,
  longitude: number,
  radius: number = 10, // km
  limit: number = 20
): Promise<Venue[]> {
  try {
    // This is a simplified approach - in a real app, you'd use PostGIS or a similar
    // spatial database feature to find venues within a radius
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .gte('latitude', latitude - radius/111) // Rough conversion from km to degrees
      .lte('latitude', latitude + radius/111)
      .gte('longitude', longitude - radius/(111 * Math.cos(latitude * Math.PI/180)))
      .lte('longitude', longitude + radius/(111 * Math.cos(latitude * Math.PI/180)))
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, 'venues near location', 'get');
    return [];
  }
}

