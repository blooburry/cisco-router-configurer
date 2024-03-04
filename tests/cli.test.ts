import { CiscoConfig } from '../src/CiscoConfig.interface';
import { formatConfig } from '../src/lib';

describe('test0', () => {
  const fileName = "R1_config";
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
  
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should be the same as a valid router config', () => {
    const contents = formatConfig(config)
    const expected = 
`!
version 12.2
 service timestamps log datetime msec
 service timestamps debug datetime msec
 service password-encryption
!
hostname ROUTER_MADELINE
!
!
!
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
!
!
!
!
!
!
aaa new-model
!
aaa authentication login default local
!
!
!
!
!
!
!
!
!
no ip cef
no ipv6 cef
!
!
!
username cisco privilege 15 password 0 cisco
!
!
!
!
!
!
!
!
ip domain-name hhs.nl
!
!
spanning-tree mode pvst
!
!
!
!
!
!
interface FastEthernet0/0
 ip address 192.168.0.1 255.255.255.0
 duplex auto
 speed auto
!
interface GigabitEthernet0/1/0
 description Interface on LAN 2
 ip address 172.16.0.1 255.255.255.0
 duplex half
 speed 1000
!
router ospf 1
 log-adjacency-changes 
 network 192.168.0.0 0.0.0.255 area 0
!
ip classless
ip route 172.16.1.0 255.255.255.0 192.168.0.5
!
ip flow-export 9
!
!
!
banner motd # Welcome at ROUTER_MADELINE! #
!
!
!
!
!
line con 0 
!
line aux 0 
!
line vty 0 4
 exec-timeout 0 60
 !
 logging synchronous
 login authentication default
 transport input ssh
!
!
!
end
`

    // Checking if the file contents match the expected value
    expect(contents).toEqual(expected);
  });
});
