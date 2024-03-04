/**
 * Cisco Router configuration file interface.
 */
export interface CiscoConfig {
    /**
     * Router version.
     * @default '16.6.4'
     */
    version?: string,
  
    /**
     * Default services for Cisco routers.
     */
    services: {
      /**
       * Debugging messages.
       * @default null
      */
      timestamps_debug?: {
        /**
         * Append either router uptime, local datetime or local datetime with millisecond precision to debug messages.
         * @default 'datetime_msec'
         */
        mode?: 'uptime' | 'datetime' | 'datetime msec',
      },
      /**
       * Configure timestamps for log messages.
       * @default null
       */
      timestamps_log?: {
        /**
         * Append either router uptime, local datetime or local datetime with millisecond precision to log messages.
         * @default 'datetime_msec'
         */
        mode?: 'uptime' | 'datetime' | 'datetime msec',
      },
      /**
       * Set automatic password encryption.
       * @default false
       */
      password_encryption?: boolean,
    },
  
    /**
     * Hostname of the router. 
     * @example 'R1'
     */
    hostname?: string,
  
    /**
     * Encrypted password for entering EXEC mode. Preferred over `enable password`.
     */
    enable_secret?: {
      ecryption_type: 5 | 7,
      plaintext: 'cisco' | 'class',
    }
  
    /**
     * Plaintext password for entering EXEC mode.
     */
    enable_password?: string,
  
    /**
     * AAA (Authentication, Authorization, and Accounting) is a security framework.
     */
    aaa_new_model?: {
      /**
       * Authentication configurations.
       */
      authentication: {
        /**
         * Access to the router.
         */
        login?: AaaAuthenticationConfig,
        /**
         * Access to EXEC mode.
         */
        enable?: AaaAuthenticationConfig,
        /**
         * Point-to-point Protocol Authentication. 
         * This configuration sets authentication methods for PPP connections, commonly used for establishing dial-up or VPN connections.
         * @default null
         */
        ppp?: AaaAuthenticationConfig,
      }
    }
  
    /**
     * Sets users for this router.
     */
    users: {
      username: 'cisco' | 'class',
      /**
       * Privilege level should be between 1 and 15, where 15 is the highest level of privilege.
       * @default 15
       */
      privilege?: number,
      password: {
        /**
         * Encyrption metehod for the password.
         * - 0: plaintext
         * - 7: Type 7 (Vinegere)
         * @default 0
         */
        encryption_type?: 0 | 7,
        /**
         * The actual password.
         */
        plaintext: 'cisco' | 'class',
      }
    }[]
  
    /**
     * Enable Cisco Express Forwarding (CEF) for IPv4 traffic.
     * @default false
     */
    ip_cef?: boolean,
  
    /**
   * Enable Cisco Express Forwarding (CEF) for IPv6 traffic.
   * @default false
   */
    ipv6_cef?: boolean,
  
    /**
     * Enables the router's DNS lookup functionality.
     * @default true
     */
    ip_domain_lookup?: boolean
  
    /**
     * Default domain name.
     */
    ip_domain_name?: string
  
    /**
     * Banner message which shows when a user connects to the router.
     */
    banner_motd?: string
    /**
     * Spanning Tree Protocol (STP) mode to Per-VLAN Spanning Tree (PVST).
     * @default 'pvst'
     */
    spanning_tree_mode?: 'pvst' | 'rapid-pvst' | 'mst'
  
    /**
     * Interfaces on this router.
     */
    interfaces: {
      port: {
        type: 'Loopback' | 'GigabitEthernet' | 'FastEthernet' | 'Serial' | 'Vlan'
        /**
         * The number associated with the port, delimited with forward slashes.
         * @example 0/0
         */
        index: string,
      },
      description?: string,
      /**
       * Ipv4 Address of the interface.
       */
      ip4_address?: {
        /**
         * 32 bit address, seperated with full stops.
         * @example '192.168.0.1'
         */
        ip: string,
        /**
         * Subnetmask prefix.
         * @example 24
         */
        subnetPrefix: number,
      },
      /**
       * Sets clock speed for DCE devices, such as a CSU/DSU (Channel Service Unit/Data Service Unit) or a router configured to act as a DCE. 
       * Only set this for serial interfaces.
       * @example 64000
       */
      clock_rate?: number,
      /**
       * Whether the connection goes two ways or not.
       * @default auto
       */
      duplex?: 'auto' | 'full' | 'half',
      /**
       * Transmission speed of data.
       * @default auto
       */
      speed?: 'auto' | '10' | '100' | '1000',
      /**
       * Allows you to specify the maximum size of packets that can be sent on the interface.
       */
      mtu?: number,
      /**
       * Turns the interface off.
       * @default true
       */
      shutdown?: boolean,
    }[]
  
    /**
     * Configures the OSPF (Open Shortest Path First) protocol on this router.
     */
    router_ospf?: {
      /**
       * Process ID of OSPF on this router.
       */
      process_id: number,
      /**
       * Enables logging when there are changes in OSPF neighbor adjacencies.
       * @default true
       */
      log_adjacency_changes?: boolean,
      /**
       * Interfaces where OSPF does respond, but does not advertise.
       */
      passive_interfaces?: {
        type: 'Loopback' | 'GigabitEthernet' | 'FastEthernet' | 'Serial' | 'Vlan'
        /**
         * The number associated with the port, delimited with forward slashes.
         * @example 0/0
         */
        index: string,
      }[],
      /**
       * Defines interfaces on which OSPF runs and defines the area ID for that interface. 
       */
      networks: {
        /**
         * IPv4 network address of the network that the interfaces are on.
         */
        ip_address: string,
        /**
         * Subnetmask prefix.
         */
        subnetPrefix: number,
        /**
         * Area ID.
         */
        area: number,
      }[]
    }
  
    /**
     * Enables CIDR.
     * @default true
     */
    ip_classless?: boolean
  
    /**
     * Statically configured routes in the routing table.
     */
    ip_route?: {
      /**
       * Ipv4 network address of the destination network.
       * @example '172.16.2.0'
       */
      destination: string,
      /**
       * Subnetmask prefix.
       * @example /24
       */
      subnetPrefix: number,
      /**
       * Ipv4 address of the forwarding router.
       * @example 192.168.0.2
       */
      forwarding_router: string,
    }[]
  
    /**
     * Enables NetFlow (collection and analysation of network data). 
     * @default {version:9}
     */
    ip_flow_export?: {
      /**
       * @default 9
       */
      version?: number
    }
  
    /**
     * Console line access.
     */
    line_con?: {
      /**
       * The first console port affected by the configuration (zero-indexed).
       * Cisco routers typically have one console port.
       * @default 0
       */
      port_start?: number,
      /**
       * The last console port affected by the configuration. 
       * Omitted when there is only one port.
       */
      port_end?: number,
    } & LineConfig,
  
    /**
     * Auxiliary line access.
     */
    line_aux?: {
      /**
       * The first auxiliary port affected by the configuration (zero-indexed).
       * Cisco routers typically have one auxiliary port.
       * @default 0
       */
      port_start?: number,
      /**
       * The last auxiliary port affected by the configuration. 
       * Omitted when there is only one port.
       */
      port_end?: number,
    } & LineConfig,
  
    /**
     * Virtual terminal line (telnet, ssh etc) access.
     */
    line_vty?: {
      /**
       * The first virtual terminal port affected by the configuration (zero-indexed).
       * Cisco routers typically have 5 virtual terminal port.
       * @default 0
       */
      port_start?: number,
      /**
       * The last virtual terminal port affected by the configuration. 
       * Omitted when there is only one port.
       * @default 4
       */
      port_end?: number,
    } & LineConfig,
  }
  
  export interface LineConfig {
  
    /**
     * Sets where logging messages are sent.
     * - synchronous: immediately to the console line, interrupting commands
     * - monitor: to the terminal monitor
     */
    logging?: 'synchronous' | 'monitor',
  
    /**
     * Password for accessing the router.
     */
    password?: {
      plaintext: 'cisco' | 'class',
    },
  
    /**
     * Configures how a user can access the router.
     * @default null => "no login"
     */
    login?: {
      /**
       * - local: use locally configured credentials
       * - authentication: use AAA authentication.
       */
      method: 'local' | 'authentication',
      /**
       * Login authentication method list using AAA.
       * Only set when `method` is set to 'authentication'.
       * @default null
       */
      method_list?: 'default' | 'MGT' | string,
    },
    /**
     * How long before a user is automatically logged out of EXEC mode.
     */
    exec_timeout: {
      /**
       * Amount of minutes.
       * Can be omitted if zero.
       */
      minutes?: number,
      /**
       * Amount of seconds.
       */
      seconds: number,
    },
  
    /**
     * Protocol used for the connection. `raw` means over raw TCP.
     */
    transport_input?: 'all' | 'none' | 'ssh' | 'telnet' | 'raw' | 'lat',
  }
  
  interface AaaAuthenticationConfig {
    /**
     * Default, or user-defined methods lists for authentication.
     * If a user-defined method list is used (like 'MGT'), it must be applied to a line or interface before it executes.
     */
    method_list: 'default' | string,
    /**
     * Specifies the source against which the password is compared during authentication.
     * - 'local': Compare against the local database.
     * - 'enable': Compare against the enable password.
     * - 'group radius': Use the configured RADIUS server(s) for authentication.
     * - 'group tacacs+': Use the configured TACACS+ server(s) for authentication.
     * - 'group ldap': Use the configured LDAP server(s) for authentication.
     * - 'group kerberos': Use the configured Kerberos server(s) for authentication.
     * - 'line': Use the line password for authentication.
     */
    source: ('local' | 'enable' | 'group radius' | 'group tacacs+' | 'group ldap' | 'group kerberos' | 'line')[]
  }