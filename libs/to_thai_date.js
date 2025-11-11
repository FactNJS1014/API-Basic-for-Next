const Datelib = {
    to_thai: (date) =>{
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('th-TH',{
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

module.exports = Datelib;