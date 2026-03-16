const fs = require('fs');
const path = require('path');

function generateSampleData() {
    const startDate = new Date('2022-01-01T00:00:00Z');
    let csvContent = 'date,value\n';
    
    // 730 days
    for (let i = 0; i < 730; i++) {
        const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Base trend
        const base = 100 + (i * (200 / 730)); // from 100 to 300
        
        // Weekly Seasonality (0 = Sunday, 6 = Saturday)
        const day = currentDate.getDay();
        const seasonal = (day === 0 || day === 6) ? 50 : 10;
        
        // Noise
        const noise = (Math.random() - 0.5) * 30; // -15 to +15
        
        let val = base + seasonal + noise;
        
        // Random spikes 1% chance
        if (Math.random() < 0.01) {
            val += (Math.random() * 100) + 50;
        }
        
        val = Math.max(0, val).toFixed(2);
        csvContent += `${dateStr},${val}\n`;
    }
    
    const dir = path.join(__dirname, '..', 'sample_data');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(dir, 'sales_data.csv'), csvContent);
    console.log("Sample data generated successfully using Node!");
}

generateSampleData();
