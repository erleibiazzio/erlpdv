// src/Helpers/McDate.js

class McDate {
    constructor(date) {
        this.locale = process.env.VUE_APP_LOCALE || 'pt-BR'; // Usa VUE_APP_LOCALE ou padrão 'pt-BR'
        if (!date) {
            throw new Error('A data não pode estar vazia.');
        }
        if (date instanceof Date) {
            this._date = date;
        } else {
            if (date.length === 10) {
                this._date = new Date(`${date} 00:00:00`);
            } else {
                this._date = new Date(date);
            }
            if (isNaN(this._date.getTime())) {
                throw new Error('Formato de data inválido.');
            }
        }
    }

    format(config) {
        return new Intl.DateTimeFormat(this.locale, config).format(this._date);
    }

    sql(options) {
        const year = this._date.getFullYear();
        const month = String(this._date.getMonth() + 1).padStart(2, '0');
        const day = String(this._date.getDate()).padStart(2, '0');

        if (options === 'date') {
            return `${year}-${month}-${day}`;
        } else if (options === 'time') {
            return this.time('full');
        } else {
            const time = this.time('full');
            return `${year}-${month}-${day} ${time}`;
        }
    }

    dateTime(options) {
        let result = null;
        if (options === 'sql') {
            const timeType = options.includes('long') ? '2-digit long' : '2-digit';
            result = this.sql('date') + ' ' + this.time(timeType);
        } else {
            options = options ? options.split(' ') : ['long'];
            const config = { day: 'numeric' };

            if (options.includes('year')) {
                config.year = 'numeric';
            }

            for (let val of ["2-digit", "numeric", "narrow", "short", "long"]) {
                if (options.includes(val)) {
                    config.month = val;
                }
            }

            if (config.month === '2-digit' || config.month === 'numeric') {
                config.day = config.month;
            }

            config.hour = '2-digit';
            config.minute = '2-digit';

            if (options.includes('long')) {
                config.second = '2-digit';
            }

            result = this.format(config);
        }
        return result;
    }

    date(options) {
        if (options === 'sql') {
            return this.sql('date');
        }

        options = options ? options.split(' ') : ['long'];
        const config = { day: 'numeric' };

        if (options.includes('year')) {
            config.year = 'numeric';
        }

        for (let val of ["2-digit", "numeric", "narrow", "short", "long"]) {
            if (options.includes(val)) {
                config.month = val;
            }
        }

        if (config.month === '2-digit' || config.month === 'numeric') {
            config.day = config.month;
        }

        return this.format(config);
    }

    time(option) {
        if (option === 'sql') {
            return this.sql('time');
        }

        option = option || 'short';
        const config = { hour: '2-digit', minute: '2-digit' };
        if (option === 'long') {
            config.second = '2-digit';
        }
        return this.format(config);
    }

    year(format) {
        format = format || 'numeric';
        return this.format({ year: format });
    }

    month(format) {
        format = format || 'long';
        return this.format({ month: format });
    }

    weekday(format) {
        format = format || 'long';
        return this.format({ weekday: format });
    }

    day(format) {
        format = format || 'numeric';
        return this.format({ day: format });
    }

    hour(format) {
        format = format || 'numeric';
        return this.format({ hour: format });
    }

    minute(format) {
        format = format || 'numeric';
        return this.format({ minute: format });
    }

    second(format) {
        format = format || 'numeric';
        return this.format({ second: format });
    }

    isToday() {
        const now = new Date();
        return now.toDateString() === this._date.toDateString();
    }

    isTomorrow() {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        return now.toDateString() === this._date.toDateString();
    }

    isYesterday() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        return now.toDateString() === this._date.toDateString();
    }

    isFuture() {
        const now = new Date();
        return now < this._date;
    }

    isPast() {
        const now = new Date();
        return now > this._date;
    }

    addDays(days) {
        this._date.setDate(this._date.getDate() + days);
        return this;
    }
}

export default McDate;
