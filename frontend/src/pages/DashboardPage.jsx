import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import Notification from "../components/Notification";
import Spinner from "../components/Spinner";
import EmailModal from "../components/modals/EmailModal";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedCard from "../components/ui/AnimatedCard";
import PreviewModal from "../components/ui/PreviewModal";
import StatCard from "../components/ui/StatCard";
import Toast from "../components/ui/Toast";
import { CertificatesIcon, TodayIcon, VerifyCountIcon } from "../components/ui/Icons";
import TemplateCard from "../components/templates/TemplateCard";
import { getTemplateById, TEMPLATE_OPTIONS } from "../components/templates/templateOptions";
import AdminLayout from "../layouts/AdminLayout";
import { fetchCertificates, generateCertificates, sendCertificateEmail } from "../services/certificateService";
import { getVerificationCount } from "../services/metrics";
import { listItemVariants } from "../animations/variants";

const DashboardPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailToast, setEmailToast] = useState("");
  const [verificationCount, setVerificationCount] = useState(0);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const loadCertificates = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await fetchCertificates(searchTerm);
      setCertificates(data);
    } catch (_error) {
      setNotification({ type: "error", message: "Failed to load certificates." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
    setVerificationCount(getVerificationCount());
  }, []);

  useEffect(() => {
    if (!emailToast) return;
    const timeoutId = setTimeout(() => setEmailToast(""), 2600);
    return () => clearTimeout(timeoutId);
  }, [emailToast]);

  const handleOpenPreview = (e) => {
    e.preventDefault();
    if (!csvFile) {
      setNotification({ type: "error", message: "Please upload a CSV file first." });
      return;
    }
    setPreviewOpen(true);
  };

  const handleGenerateConfirm = async () => {
    setSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const result = await generateCertificates(csvFile, selectedTemplate);
      setNotification({ type: "success", message: result.message });
      setCsvFile(null);
      setPreviewOpen(false);
      await loadCertificates(search);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Certificate generation failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEmailModal = (certificate) => {
    setSelectedCertificate(certificate);
    setEmailModalOpen(true);
  };

  const handleSendEmail = async (payload) => {
    setSendingEmail(true);
    try {
      const data = await sendCertificateEmail(payload);
      setNotification({ type: "success", message: data.message || "Certificate sent successfully." });
      setEmailToast("Certificate email sent successfully.");
      setEmailModalOpen(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to send certificate email.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredCertificates = useMemo(() => {
    if (!search) return certificates;
    const term = search.toLowerCase();
    return certificates.filter(
      (item) => item.name.toLowerCase().includes(term) || item.certificateId.toLowerCase().includes(term)
    );
  }, [certificates, search]);

  const todayDate = new Date().toDateString();
  const generatedToday = certificates.filter((item) => new Date(item.createdAt || item.issueDate).toDateString() === todayDate).length;

  return (
    <AdminLayout title="Dashboard">
      <Toast open={Boolean(emailToast)} message={emailToast} type="success" />
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Certificates" value={certificates.length} icon={<CertificatesIcon />} colorClass="text-primary-600" />
          <StatCard label="Generated Today" value={generatedToday} icon={<TodayIcon />} colorClass="text-secondary-600" />
          <StatCard label="Total Verifications" value={verificationCount} icon={<VerifyCountIcon />} colorClass="text-accent-600" />
        </section>

        <AnimatedCard className="bg-gradient-to-br from-white to-primary-50/70 dark:from-slate-900 dark:to-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Generate Certificates</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload CSV with columns: name,event,date</p>

          <form onSubmit={handleOpenPreview} className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Template Selection</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  {TEMPLATE_OPTIONS.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <AnimatedButton type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white lg:w-auto">
                {submitting ? <Spinner small /> : null}
                Preview & Generate
              </AnimatedButton>
            </div>
          </form>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TEMPLATE_OPTIONS.map((template, index) => (
              <motion.div key={template.id} custom={index} variants={listItemVariants} initial="initial" animate="animate">
                <TemplateCard
                  template={template}
                  selected={selectedTemplate === template.id}
                  onSelect={setSelectedTemplate}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            <Notification type={notification.type} message={notification.message} />
          </div>
        </AnimatedCard>

        <AnimatedCard className="overflow-hidden">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Certificates</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or certificate ID"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 sm:w-80 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredCertificates.length === 0 ? (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">No certificates found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Certificate ID</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900">
                  {filteredCertificates.map((certificate) => (
                    <tr
                      key={certificate._id}
                      className="border-t border-slate-100 transition hover:bg-primary-50/50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{certificate.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{certificate.event}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </td>
                      <td className="max-w-[260px] truncate px-4 py-3 text-slate-600 dark:text-slate-400">
                        {certificate.certificateId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <AnimatedButton
                            onClick={() => window.open(certificate.pdfUrl, "_blank", "noopener,noreferrer")}
                            className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          >
                            Download PDF
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => handleOpenEmailModal(certificate)}
                            className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white"
                          >
                            <FaEnvelope className="h-3.5 w-3.5" />
                            Send via Email
                          </AnimatedButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatedCard>
      </div>

      <PreviewModal
        open={previewOpen}
        template={getTemplateById(selectedTemplate)}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleGenerateConfirm}
        loading={submitting}
      />

      <EmailModal
        open={emailModalOpen}
        certificate={selectedCertificate}
        loading={sendingEmail}
        onClose={() => setEmailModalOpen(false)}
        onSend={handleSendEmail}
      />
    </AdminLayout>
  );
};

export default DashboardPage;
