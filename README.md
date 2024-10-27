# Pi-Hole-Dashboard (Custom}

## Description

Pi-Hole-Dashboard is a custom web interface designed to monitor and visualize the performance and activity of multiple Pi-Hole instances. Utilizing Vite for fast and efficient builds, this dashboard offers detailed statistics, logs, and system metrics in a user-friendly format.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/neomagic100/Pi-Hole-Dashboard.git
   ```
2. **Navigate to the Directory**
   ```bash
   cd Pi-Hole-Dashboard
   ```
3. **Install Dependencies using Vite**
   ```bash
   npm install -g vite@latest
   npm install
   ```
4. **Configure Pi-Hole Instances**

   Update the configuration file "src/config/config.json" to add the IP addresses and API tokens for each Pi-Hole instance you want to monitor.

5. **Build the Project for Production**
   ```bash
   vite build
   ```

## Usage

The interface will display various statistics about your Pi-Hole instances, including blocked queries, top domains, and client activity.

## Features

- **Real-time Monitoring**: View live data on blocked queries and network activity across multiple Pi-Hole instances.
- **Historical Data**: Access logs and long-term statistics for in-depth analysis.
- **Responsive Design**: Works well on desktops, tablets, and mobile devices.
- **Customizable Views**: Tailor the dashboard to display the metrics most important to you.
- **Vite-Powered**: Experience fast build and hot-reload times with Vite.

## Build Instructions Using Lighttpd

1. **Install Lighttpd**
   ```bash
   sudo apt-get install lighttpd
   ```
2. **Copy Configuration Files**
   ```bash
   sudo cp -r /path/to/your/lighttpd-config-directory /etc/lighttpd/
   ```
3. **Enable Configuration**
   ```bash
   sudo ln -s /etc/lighttpd/lighttpd.conf /etc/lighttpd/conf-enabled/99-pihole-dashboard.conf
   ```
4. **Build the Project**
   ```bash
   vite build
   ```
5. **Deploy to Lighttpd Directory**
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```
6. **Restart Lighttpd**
   ```bash
   sudo systemctl restart lighttpd
   ```

## Disclaimer
As this project is developed for inter-network use, it has no login, authentication, or authorization. It is therefore not, by any means, secure.


## Contributing

We welcome contributions! Please fork this repository and submit pull requests. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the **GPL-3.0** License. See the LICENSE file for more details.
```
