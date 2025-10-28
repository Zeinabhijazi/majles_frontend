import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function IconBreadcrumbs() {
  const t1 = useTranslations("dashboard");
  const t2 = useTranslations("heading");
  return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          style={{ display: 'flex', alignItems: 'center' }}
          href='/admin/orders'
        >
          <Typography
          sx={{ color: 'text.secondary', fontSize: "20px", display: 'flex', alignItems: 'center' }}
        >
          {t1("orders")}
        </Typography>
        </Link>
        <Typography
          sx={{ color: 'secondary.main', fontSize: "20px", display: 'flex', alignItems: 'center', }}
        >
          {t2("readersPage")}
        </Typography>
      </Breadcrumbs>
  );
}
