import { CiscoConfig } from "./CiscoConfig.interface";
import { exportConfig, formatConfig } from "./lib";

// Example usage.
function main() {
    // A CiscoConfig object is created as a TypeScript object.
    const config: CiscoConfig = {
        version: "12.2",
        services: {
          timestamps_debug: {
            mode: "datetime msec",
          },
          timestamps_log: {
            mode: "datetime msec",
          },
          password_encryption: true,
        },
        hostname: "ROUTER_MADELINE",
        enable_secret: {
          ecryption_type: 5,
          plaintext: "cisco",
        },
        users: [
          {
            username: "cisco",
            privilege: 15,
            password: {
              plaintext: "cisco",
            },
          },
        ],
        aaa_new_model: {
          authentication: {
            login: {
              method_list: "default",
              source: ["local"],
            },
          },
        },
        ip_domain_lookup: false,
        ip_domain_name: "hhs.nl",
        banner_motd: "Welcome at ROUTER_MADELINE!",
        interfaces: [
          {
            port: {
              type: "FastEthernet",
              index: "0/0",
            },
            ip4_address: {
              ip: "192.168.0.1",
              subnetPrefix: 24,
            },
            shutdown: false,
          },
          {
            port: {
              type: "GigabitEthernet",
              index: "0/1/0",
            },
            ip4_address: {
              ip: "172.16.0.1",
              subnetPrefix: 24,
            },
            description: "Interface on LAN 2",
            duplex: "half",
            speed: "1000",
            shutdown: false,
          },
        ],
        router_ospf: {
          process_id: 1,
          networks: [
            {
              ip_address: "192.168.0.0",
              subnetPrefix: 24,
              area: 0,
            },
          ],
        },
        ip_classless: true,
        ip_route: [
          {
            destination: "172.16.1.0",
            subnetPrefix: 24,
            forwarding_router: "192.168.0.5",
          },
        ],
        line_vty: {
          exec_timeout: {
            minutes: 0,
            seconds: 60,
          },
          logging: "synchronous",
          login: {
            method: "authentication",
            method_list: "default",
          },
          transport_input: "ssh",
        },
      };

      // Now we can format the configuration object as a valid Cisco router configuration.
      const formattedConfig = formatConfig(config);

      // Then we export it as a file. The .txt extension is automatically added.
      exportConfig(formattedConfig, 'R0_config');

      // The result should be in the '../../output' directory.
}

main();