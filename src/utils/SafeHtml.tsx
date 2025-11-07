// components/SafeHtml.tsx
import DOMPurify from 'dompurify';
import { Box, BoxProps } from '@mui/material';

interface Props extends BoxProps {
  html: string;
}

export default function SafeHtml({ html, ...props }: Props) {
  const clean = DOMPurify.sanitize(html);
  return <Box {...props} dangerouslySetInnerHTML={{ __html: clean }} />;
}