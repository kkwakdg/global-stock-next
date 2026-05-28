import ModalWrapper from "../../../components/ModalWrapper";
import StockDetailContent from "../../../components/StockDetailContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StockDetailModal({ params }: Props) {
  const { id } = await params;

  return (
    <ModalWrapper>
      <StockDetailContent stockId={id} isModal />
    </ModalWrapper>
  );
}
