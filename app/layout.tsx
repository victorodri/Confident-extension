export const metadata = {
  title: 'Confident',
  description: 'Tu confidente en cada conversación importante',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
