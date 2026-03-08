const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Create directory to store scraped images
const imagesDir = path.join(__dirname, 'website_images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, folderPath, fileName) {
    try {
        // Handle relative URLs by converting them to absolute
        const absoluteUrl = url.startsWith('http') ? url : new URL(url, 'https://travellounge.mu/').href;
        
        const response = await axios({
            method: 'GET',
            url: absoluteUrl,
            responseType: 'stream',
            timeout: 10000, // 10 second timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Extract file extension if not provided in filename
        if (!fileName.includes('.')) {
            const contentType = response.headers['content-type'];
            let ext = '';
            if (contentType && contentType.startsWith('image/')) {
                ext = '.' + contentType.split('/')[1].split(';')[0]; // Take only the format part
            } else {
                // Try to extract from URL
                const urlExtMatch = absoluteUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|webp)/i);
                if (urlExtMatch) {
                    ext = urlExtMatch[0];
                } else {
                    ext = '.jpg'; // default
                }
            }
            fileName += ext;
        }

        // Sanitize filename
        fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        const filePath = path.join(folderPath, fileName);
        
        const writer = response.data.pipe(fs.createWriteStream(filePath));
        
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Downloaded: ${fileName}`);
                resolve(filePath);
            });
            writer.on('error', (err) => {
                console.error(`Error downloading ${absoluteUrl}:`, err.message);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
        return null;
    }
}

async function scrapeWebsiteImages() {
    try {
        console.log('Fetching website content from https://travellounge.mu/ ...');
        
        const response = await axios.get('https://travellounge.mu/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        const imageUrls = [];
        
        // Find all image tags
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src) {
                // Skip data URIs and invalid URLs
                if (!src.startsWith('data:') && !src.startsWith('javascript:')) {
                    imageUrls.push(src);
                }
            }
        });
        
        // Find images in CSS background properties (if any are directly in HTML)
        $('[style*="background"]').each((index, element) => {
            const style = $(element).attr('style');
            if (style) {
                const matches = style.match(/background(?:-image)?:\s*url\(['"]?(.*?)['"]?\)/gi);
                if (matches) {
                    matches.forEach(match => {
                        const urlMatch = match.match(/url\(['"]?(.*?)['"]?\)/i);
                        if (urlMatch && urlMatch[1]) {
                            const bgImageUrl = urlMatch[1];
                            if (!bgImageUrl.startsWith('data:') && !bgImageUrl.startsWith('javascript:')) {
                                imageUrls.push(bgImageUrl);
                            }
                        }
                    });
                }
            }
        });
        
        // Remove duplicates
        const uniqueImageUrls = [...new Set(imageUrls)];
        
        console.log(`Found ${uniqueImageUrls.length} unique images on the website`);
        
        if (uniqueImageUrls.length === 0) {
            console.log('No images found on the website');
            return;
        }
        
        console.log('Downloading images...');
        
        let downloadedCount = 0;
        const promises = uniqueImageUrls.map(async (imgUrl, index) => {
            try {
                // Generate a filename based on the image URL
                let fileName = `image_${index}`;
                
                // Try to extract a more descriptive name if possible
                const urlParts = imgUrl.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                if (lastPart && lastPart.includes('.')) {
                    fileName = lastPart.split('.')[0] || fileName;
                }
                
                const result = await downloadImage(
                    imgUrl,
                    imagesDir,
                    fileName
                );
                
                if (result) {
                    downloadedCount++;
                }
            } catch (error) {
                console.error(`Error processing image ${imgUrl}:`, error.message);
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
        console.log(`Total unique images found on website: ${uniqueImageUrls.length}`);
        
    } catch (error) {
        console.error('Error scraping website:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the scraper
scrapeWebsiteImages().catch(console.error);