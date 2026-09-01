type TenantActionsProps = {
  status: "Active" | "Inactive";
  onView?: () => void;
  onEdit?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
};

const TenantActions = ({
  status,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
}: TenantActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onView}
        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
      >
        View
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
      >
        Edit
      </button>

      {status === "Active" ? (
        <button
          type="button"
          onClick={onDeactivate}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
        >
          Deactivate
        </button>
      ) : (
        <button
          type="button"
          onClick={onActivate}
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-100"
        >
          Activate
        </button>
      )}
    </div>
  );
};

export default TenantActions;