import AccountPilgrimsEditForm from "@/components/pages/account/pilgrims_edit_form";

type Props = { params: Promise<{ id: string }> };

const PilgrimsEditPage = async ({ params }: Props) => {
  const { id } = await params;
  return <AccountPilgrimsEditForm id={id} />;
};

export default PilgrimsEditPage;
