import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb as BreadcrumbMenu,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
} from '@chakra-ui/react';

export default function Breadcrumb({ domain, domainKey }) {
  const [ breadcrumbs ] = useState(window.location.pathname.split('/'));
  return (
    <Center py="4">
      <BreadcrumbMenu>
        {breadcrumbs.map((item, index) => {
          if(domain?._id == item) item = domain[domainKey];
          item = item.charAt(0).toUpperCase() + item.slice(1);
          if(item=='' && index==0) return (
            <BreadcrumbItem key={'breadcrumb-'+index}>
              <Link to='/'>Home</Link>
            </BreadcrumbItem>
          );
          if (index!=breadcrumbs.length-1) {
            let href = '';
            for (let i = 0; i < index+1; i++) {
              if (breadcrumbs[i]!='') href = href + '/' + breadcrumbs[i]
            }
            return (
              <BreadcrumbItem key={'breadcrumb-'+index}>
                <Link to={href}>{item}</Link>
              </BreadcrumbItem>
            );
          }
          if (index==breadcrumbs.length-1) {
            return (
              <BreadcrumbItem isCurrentPage key={'breadcrumb-'+index}>
                <BreadcrumbLink href="#">{item}</BreadcrumbLink>
              </BreadcrumbItem>
            );
          }
        })}
      </BreadcrumbMenu>
    </Center>
  );
};