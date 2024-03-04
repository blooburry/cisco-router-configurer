import fs from 'fs';
import { CiscoConfig, LineConfig } from './CiscoConfig.interface';

export function formatConfig(o: CiscoConfig): string {
  const res =
    `!
version ${o.version ?? '16.6.4'}
${o.services.timestamps_log ? '' : 'no'} service timestamps log ${o.services.timestamps_log?.mode ?? 'datetime msec'}
${o.services.timestamps_debug ? '' : 'no'} service timestamps debug ${o.services.timestamps_debug?.mode ?? 'datetime msec'}
${o.services.password_encryption ? '' : 'no'} service password-encryption
!
${o.hostname ? 'hostname ' + o.hostname : '!'}
!
!
!
${o.enable_secret ?
      'enable secret ' + o.enable_secret.ecryption_type + ' ' + encryptPassword(o.enable_secret.plaintext, o.enable_secret.ecryption_type)
      : '!'
    }
${o.enable_password ?
      'enable password ' + o.enable_password
      : '!'
    }
!
!
!
!
!
${o.aaa_new_model ? 'aaa new-model' : '!'}
!
${o.aaa_new_model?.authentication.login ?
      'aaa authentication login ' + o.aaa_new_model.authentication.login.method_list + ' ' + o.aaa_new_model.authentication.login.source.join(' ')
      : '!'
    }
${o.aaa_new_model?.authentication.enable ?
      'aaa authentication enable ' + o.aaa_new_model.authentication.enable.method_list + ' ' + o.aaa_new_model.authentication.enable.source.join(' ')
      : '!'
    }
${o.aaa_new_model?.authentication.ppp ?
      'aaa authentication enable ' + o.aaa_new_model.authentication.ppp.method_list + ' ' + o.aaa_new_model.authentication.ppp.source.join(' ')
      : '!'
    }
!
!
!
!
!
!
!
${o.ip_cef ? '' : 'no'} ip cef
${o.ipv6_cef ? '' : 'no'} ipv6 cef
!
!
!
${o.users.length > 0 ?
      (o.users.map(u =>
        'username ' + u.username + ' privilege ' + u.privilege + ' password ' + (u.password.encryption_type ?? '0') + ' ' + encryptPassword(u.password.plaintext, u.password.encryption_type ?? 0)
      ).join('\n'))
      : '!'
    }
!
!
!
!
!
!
!
!
${o.ip_domain_name ? 'ip domain-name ' + o.ip_domain_name : '!'}
!
!
spanning-tree mode ${o.spanning_tree_mode ?? 'pvst'}
!
!
!
!
!
!
${o.interfaces.length > 0 ?
      o.interfaces.map(i =>
        'interface ' + i.port.type + i.port.index + '\n' +
        (i.description ? ' description ' + i.description + '\n' : '') +
        ' ' + (i.ip4_address ? 'ip address ' + i.ip4_address.ip + ' ' + convertToSubnetmask(i.ip4_address.subnetPrefix) : 'no ip address') + '\n' +
        ' duplex ' + (i.duplex ?? 'auto') + '\n' +
        ' speed ' + (i.speed ?? 'auto') + '\n' +
        (i.clock_rate ? ' clock rate' + i.clock_rate + '\n' : '')
      ).join('!\n')
      : ''
    }!
${o.router_ospf ?
      'router ospf ' + o.router_ospf.process_id + '\n' +
      ' ' + (o.router_ospf.log_adjacency_changes === undefined || o.router_ospf.log_adjacency_changes === true ?  '' : 'no ') + 'log-adjacency-changes \n' +
      ((o.router_ospf.passive_interfaces) && o.router_ospf.passive_interfaces.length > 0 ?
        o.router_ospf.passive_interfaces.map(i =>
          ' passive-interface ' + i.type + i.index
        ).join('\n') + '\n'
        : ''
      ) +
      ((o.router_ospf.networks) && o.router_ospf.networks.length > 0 ?
        o.router_ospf.networks.map(n =>
          ' network ' + n.ip_address + ' ' + convertToWildcardmask(n.subnetPrefix) + ' area ' + n.area
        ).join('\n')
        : ''
      )
      : '!'
    }
!
${o.ip_classless ? '' : 'no '}ip classless
${(o.ip_route) && (o.ip_route.length > 0) ?
      o.ip_route.map(r =>
        'ip route ' + r.destination + ' ' + convertToSubnetmask(r.subnetPrefix) + ' ' + r.forwarding_router
      ).join('\n')
      : '!'
    }
!
${o.ip_flow_export || (o.ip_flow_export === undefined) ? '' : 'no '}ip flow-export ${o.ip_flow_export?.version ?? 9}
!
!
!
${o.banner_motd ? 'banner motd # ' + o.banner_motd + ' #' : '!'}
!
!
!
!
!
line con ${o.line_con?.port_start ?? 0} ${o.line_con?.port_end ?? ''}
${o.line_con ? formatLineConfig(o.line_con) : ''}!
line aux ${o.line_aux?.port_start ?? 0} ${o.line_aux?.port_end ?? ''}
${o.line_aux ? formatLineConfig(o.line_aux) : ''}!
line vty ${o.line_vty?.port_start ?? 0} ${o.line_vty?.port_end ?? 4}
${o.line_vty ? formatLineConfig(o.line_vty) : ''}!
!
!
end
`

  return res;
}

function formatLineConfig(c: LineConfig) {
  const res =
` exec-timeout ${c.exec_timeout.minutes ?? ''} ${c.exec_timeout.seconds}
 ${c.password ? 'password ' + c.password.plaintext : '!'}
 ${c.logging ? 'logging ' + c.logging : '!'}
 ${c.login ? 'login ' + c.login.method + ' ' + c.login.method_list : 'no login'}
 ${c.transport_input ? 'transport input ' + c.transport_input : '!'}
`;

  return res;
}

function encryptPassword(plaintext: 'cisco' | 'class', type: 0 | 5 | 7): string {
  if(type == 0) return plaintext;
  switch(type) {
    case 5:
      if(plaintext === 'cisco') return '$1$mERr$hx5rVt7rPNoS4wqbXKX7m0';
      else return '$1$mERr$9cTjUIEqNGurQiFU.ZeCil';
    case 7:
      if(plaintext === 'cisco') return '0822455D0A16';
      else return '0822404F1A0A';
  }
}

export function exportConfig(c: string, fileName: string) {
  fs.writeFile('output/' + fileName + '.txt', c, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File saved successfully:', fileName);
    }
  });
}

function convertToSubnetmask(prefix: number) {
  if (prefix < 0 || prefix > 32) {
    throw new Error("Invalid IPv4 prefix");
  }
  const subnetmask: number[] = [0, 0, 0, 0];
  for (let i = 0; i < prefix; i++) {
    subnetmask[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
  }
  return subnetmask.join(".");
}

function convertToWildcardmask(prefix: number) {
  if (prefix < 0 || prefix > 32) {
    throw new Error("Invalid IPv4 prefix");
  }
  const wildcardmask: number[] = [255, 255, 255, 255];
  for (let i = 0; i < prefix; i++) {
    wildcardmask[Math.floor(i / 8)] &= ~(1 << (7 - (i % 8)));
  }
  return wildcardmask.join(".");
}

export { CiscoConfig };
