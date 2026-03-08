const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
    console.error('Please set these environment variables before running this script');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadImage(url, folderPath, fileName) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        // Extract file extension if not provided
        if (!fileName.includes('.')) {
            const contentType = response.headers['content-type'];
            let ext = '';
            if (contentType && contentType.startsWith('image/')) {
                ext = '.' + contentType.split('/')[1];
            } else {
                // Try to extract from URL
                const urlExtMatch = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                if (urlExtMatch) {
                    ext = urlExtMatch[0];
                } else {
                    ext = '.jpg'; // default
                }
            }
            fileName += ext;
        }

        const filePath = path.join(folderPath, fileName);
        
        const writer = response.data.pipe(fs.createWriteStream(filePath));
        
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Downloaded: ${fileName}`);
                resolve(filePath);
            });
            writer.on('error', (err) => {
                console.error(`Error downloading ${url}:`, err.message);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
        return null;
    }
}

async function getAllImages() {
    const allImages = [];
    
    // Get hero slide images
    const { data: heroSlides, error: heroError } = await supabase
        .from('hero_slides')
        .select('image_url');
    
    if (heroError) {
        console.error('Error fetching hero slides:', heroError.message);
    } else {
        heroSlides.forEach(slide => {
            if (slide.image_url) {
                allImages.push({
                    url: slide.image_url,
                    category: 'hero_slides',
                    id: `slide_${slide.id || allImages.length}`
                });
            }
        });
    }
    
    // Get services images
    const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('images, name, id');
    
    if (servicesError) {
        console.error('Error fetching services:', servicesError.message);
    } else {
        services.forEach(service => {
            if (service.images && Array.isArray(service.images) && service.images.length > 0) {
                service.images.forEach((img, idx) => {
                    if (img) {
                        allImages.push({
                            url: img,
                            category: 'services',
                            id: `service_${service.id}_${idx}`,
                            name: service.name
                        });
                    }
                });
            }
        });
    }
    
    // Get media table images
    const { data: media, error: mediaError } = await supabase
        .from('media')
        .select('url, filename, id');
    
    if (mediaError) {
        console.error('Error fetching media:', mediaError.message);
    } else {
        media.forEach(medium => {
            if (medium.url) {
                allImages.push({
                    url: medium.url,
                    category: 'media',
                    id: `media_${medium.id}`,
                    name: medium.filename
                });
            }
        });
    }
    
    // Get team member photos
    const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('photo_url, name, id');
    
    if (teamError) {
        console.error('Error fetching team members:', teamError.message);
    } else {
        teamMembers.forEach(member => {
            if (member.photo_url) {
                allImages.push({
                    url: member.photo_url,
                    category: 'team_members',
                    id: `team_${member.id}`,
                    name: member.name
                });
            }
        });
    }
    
    // Get testimonial avatars
    const { data: testimonials, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('avatar_url, customer_name, id');
    
    if (testimonialsError) {
        console.error('Error fetching testimonials:', testimonialsError.message);
    } else {
        testimonials.forEach(testimonial => {
            if (testimonial.avatar_url) {
                allImages.push({
                    url: testimonial.avatar_url,
                    category: 'testimonials',
                    id: `testimonial_${testimonial.id}`,
                    name: testimonial.customer_name
                });
            }
        });
    }
    
    // Get promotions images
    const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select('image, title, id');
    
    if (promosError) {
        console.error('Error fetching promotions:', promosError.message);
    } else {
        promotions.forEach(promotion => {
            if (promotion.image) {
                allImages.push({
                    url: promotion.image,
                    category: 'promotions',
                    id: `promo_${promotion.id}`,
                    name: promotion.title
                });
            }
        });
    }
    
    // Get flights images
    const { data: flights, error: flightsError } = await supabase
        .from('flights')
        .select('logo_url, airline, id');
    
    if (flightsError) {
        console.error('Error fetching flights:', flightsError.message);
    } else {
        flights.forEach(flight => {
            if (flight.logo_url) {
                allImages.push({
                    url: flight.logo_url,
                    category: 'flights',
                    id: `flight_${flight.id}`,
                    name: flight.airline
                });
            }
        });
    }
    
    return allImages;
}

async function main() {
    console.log('Starting image collection from database...');
    
    const allImages = await getAllImages();
    console.log(`Found ${allImages.length} images in database`);
    
    // Create main images directory
    const imagesDir = path.join(__dirname, 'collected_images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Create subdirectories for each category
    const categories = [...new Set(allImages.map(img => img.category))];
    categories.forEach(category => {
        const catDir = path.join(imagesDir, category);
        if (!fs.existsSync(catDir)) {
            fs.mkdirSync(catDir, { recursive: true });
        }
    });
    
    console.log('Downloading images...');
    
    let downloadedCount = 0;
    const promises = allImages.map(async (img, index) => {
        try {
            // Create a safe filename
            let fileName = img.id;
            if (img.name) {
                // Create a safe filename from the name
                fileName = img.name
                    .replace(/[^a-zA-Z0-9]/g, '_')
                    .substring(0, 50) + '_' + img.id;
            }
            
            const result = await downloadImage(
                img.url,
                path.join(imagesDir, img.category),
                fileName
            );
            
            if (result) {
                downloadedCount++;
            }
        } catch (error) {
            console.error(`Error processing image ${img.url}:`, error.message);
        }
    });
    
    // Process in batches of 5 to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);
        await Promise.allSettled(batch);
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(promises.length / batchSize)}`);
    }
    
    console.log(`\nCompleted! Downloaded ${downloadedCount} images to ${imagesDir}`);
    console.log(`Total images found in database: ${allImages.length}`);
}

// Run the script
main().catch(console.error);