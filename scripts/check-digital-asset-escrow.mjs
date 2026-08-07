import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const required = [
    'src/pages/EscrowBoxCreatePage.jsx',
    'src/pages/EscrowBoxJoinPage.jsx',
    'src/pages/EscrowBoxAssignedInvitePage.jsx',
    'src/pages/EscrowBoxesPage.jsx',
    'src/pages/EscrowBoxDetailPage.jsx',
    'src/pages/EscrowBoxTermsPage.jsx',
    'src/hooks/marketplace/useEscrowBoxTermsForm.js',
    'src/hooks/marketplace/escrowBoxFormModel.js',
    'src/components/escrow-box/EscrowBoxAssetFields.jsx',
    'src/components/escrow-box/EscrowBoxCounterpartyInviteSection.jsx',
    'src/hooks/marketplace/useEscrowBoxForm.js',
    'src/hooks/marketplace/useEscrowBoxDetail.js',
    'src/styles/escrow-box.css',
]
for (const relative of required) {
    if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing MBN escrow box owner: ${relative}`)
}
const repository = read('src/services/repositories/marketplace.js')
for (const token of ['/customer/escrow-boxes', '/join/${token}/claim', '/assigned-invite/${token}', '/assigned-invite/${token}/accept', '/confirm-receipt', '/disputes', '/invite/rotate', '/clone', '/counterparty-candidates/resolve', '/counterparty-invite']) {
    if (!repository.includes(token)) throw new Error(`MBN escrow repository missing ${token}`)
}
const createPage = read('src/pages/EscrowBoxCreatePage.jsx')
for (const forbidden of ['counterparty_username', 'initiator_role']) {
    if (createPage.includes(forbidden)) throw new Error(`Escrow Box must not ask for ${forbidden}`)
}
for (const token of ['Bên A', 'Bên B', 'link dùng một lần', 'BaseForm']) {
    if (!createPage.includes(token)) throw new Error(`Escrow Box create page missing ${token}`)
}
const joinPage = read('src/pages/EscrowBoxJoinPage.jsx')
for (const token of ['Đồng ý trở thành Bên B', 'không thể truy cập', 'escrowBoxRepository.claim']) {
    if (!joinPage.includes(token)) throw new Error(`Escrow Box join page missing ${token}`)
}
const assignedInvitePage = read('src/pages/EscrowBoxAssignedInvitePage.jsx')
for (const token of ['Đồng ý tham gia với vai trò', 'previewAssignedInvite', 'acceptAssignedInvite']) {
    if (!assignedInvitePage.includes(token)) throw new Error(`Assigned Escrow Box invite page missing ${token}`)
}
const stylesheetManifest = read('src/index.css')
if (!stylesheetManifest.includes('./styles/escrow-box.css')) throw new Error('Escrow Box CSS must be registered in the deterministic stylesheet manifest')
for (const page of ['src/pages/EscrowBoxCreatePage.jsx', 'src/pages/EscrowBoxJoinPage.jsx',
    'src/pages/EscrowBoxAssignedInvitePage.jsx', 'src/pages/EscrowBoxesPage.jsx', 'src/pages/EscrowBoxDetailPage.jsx', 'src/pages/EscrowBoxTermsPage.jsx', 'src/pages/EscrowBoxAssignedInvitePage.jsx']) {
    if (/^import\s+[\"\'][^\"\']+\.(?:css|scss)[\"\'];?\s*$/m.test(read(page))) {
        throw new Error(`Escrow Box page must not side-effect import CSS: ${page}`)
    }
}
const detailPage = read('src/pages/EscrowBoxDetailPage.jsx')
if (detailPage.indexOf('useMemo(') > detailPage.indexOf('if (box.loading')) throw new Error('EscrowBoxDetailPage hooks must run before conditional returns')
for (const token of ['Lịch sử Box', 'Lấy link mới', 'Sao chép thành box mới', 'data.can_update', 'data.can_cancel', 'EscrowBoxCounterpartyInviteSection', 'Chấp nhận tham gia Box', 'onReload={box.reload}', 'Cập nhật', 'PageStack', 'escrow-box-detail-stack', 'aria-label="Thao tác vòng đời Box"']) {
    if (!detailPage.includes(token)) throw new Error(`Escrow Box detail page missing ${token}`)
}

const createHook = read('src/hooks/marketplace/useEscrowBoxForm.js')
for (const token of [
    'showToast("success", "Đã tạo Box giao dịch trung gian.")',
    'navigate(`/account/escrow-boxes/${response.box.id}`',
    'state: { createdInvitePath: response.invite_path || "" }',
]) {
    if (!createHook.includes(token)) throw new Error(`Escrow Box create success flow missing ${token}`)
}
if (createPage.includes('if (form.created)')) {
    throw new Error('Escrow Box create must navigate directly to detail after success, not stop on an intermediate success page')
}
const termsHook = read('src/hooks/marketplace/useEscrowBoxTermsForm.js')
for (const token of [
    'showToast("success", "Đã cập nhật Box giao dịch trung gian.")',
    'reset(escrowBoxValuesFromRecord(updatedBox))',
]) {
    if (!termsHook.includes(token)) throw new Error(`Escrow Box update success flow missing ${token}`)
}
if (termsHook.includes('navigate(`/account/escrow-boxes/${id}`)')) {
    throw new Error('Escrow Box update must remain on the edit page after success')
}
if (!detailPage.includes('location.state?.createdInvitePath')) {
    throw new Error('Escrow Box detail must preserve the one-time invite link passed after creation')
}

const listPage = read('src/pages/EscrowBoxesPage.jsx')
if (!listPage.includes('actions={<GamingLink to="/account/escrow-boxes/new"')) throw new Error('Escrow Box create action must live in the Box list page')
const termsPage = read('src/pages/EscrowBoxTermsPage.jsx')
for (const token of ['useEscrowBoxTermsForm', 'EscrowBoxAssetFields', 'error={form.errors.topup_amount}', 'id="escrow-box-update-form"', 'form="escrow-box-update-form"', '>\n                    Cập nhật\n                </GamingButton>', 'aria-label="Thao tác cập nhật Box"']) {
    if (!termsPage.includes(token)) throw new Error(`Escrow Box terms form missing ${token}`)
}
if (termsPage.includes('Lưu phiên bản mới')) {
    throw new Error('Escrow Box update submit label must use the natural customer-facing text Cập nhật')
}
const formModel = read('src/hooks/marketplace/escrowBoxFormModel.js')
for (const token of ['buildEscrowBoxPayload', 'values.deal_type === "exchange_with_topup"', 'validateEscrowBoxValues']) {
    if (!formModel.includes(token)) throw new Error(`Escrow Box form model missing ${token}`)
}
const inviteSection = read('src/components/escrow-box/EscrowBoxCounterpartyInviteSection.jsx')
for (const token of ['useBaseForm', 'applyValidationError', 'error={form.errors.phone}', 'Tìm khách hàng', 'Chọn và gửi lời mời', 'candidate_token']) {
    if (!inviteSection.includes(token)) throw new Error(`Escrow Box phone invite form missing ${token}`)
}

if (inviteSection.includes('Không cần tự kiểm độ dài')) {
    throw new Error('Escrow Box customer UI must not expose technical validation implementation copy')
}
if (!detailPage.includes('type="button"') || !detailPage.includes('escrow-box-footer-actions')) {
    throw new Error('Escrow Box cancel/clone actions must be independent non-submit lifecycle actions')
}
const escrowStyles = read('src/styles/escrow-box.css')
for (const token of ['.escrow-box-detail-stack', 'gap: 1rem', '.escrow-box-footer-actions', 'margin-top: 1.25rem', '.escrow-box-page-actions', 'flex-wrap: nowrap', 'grid-template-columns: repeat(2, minmax(0, 1fr))']) {
    if (!escrowStyles.includes(token)) throw new Error(`Escrow Box spacing/action ownership missing ${token}`)
}
const moneyInput = read('src/components/base/MoneyInput.jsx')
if (!moneyInput.includes('aria-invalid={invalid || undefined}')) throw new Error('MoneyInput must expose field invalid state')
const contract = JSON.parse(read('src/contracts/marketplace-contract.json'))
if (contract.contract_version !== '2026-08-06.6' || !contract.capabilities?.escrow_box_phone_counterparty_invite || !contract.capabilities?.escrow_box_field_validation_mapping || !contract.capabilities?.private_escrow_box || !contract.capabilities?.escrow_box_private_optimized_media || !contract.capabilities?.escrow_box_dual_private_acceptance_links || !contract.capabilities?.escrow_box_creator_only_cancel || !contract.capabilities?.escrow_box_invite_rotation || !contract.capabilities?.escrow_box_clone_after_cancel || !contract.capabilities?.escrow_box_parent_activity_timeline) {
    throw new Error('MBN marketplace contract is stale')
}
for (const legacy of ['src/pages/DirectEscrowCreatePage.jsx', 'src/hooks/marketplace/useDirectEscrowForm.js']) {
    if (fs.existsSync(path.join(root, legacy))) throw new Error(`Legacy direct escrow owner must not coexist: ${legacy}`)
}

if (detailPage.includes('actions={') && detailPage.includes('Cập nhật box')) {
    throw new Error('Escrow Box update action must live beside lifecycle actions, not in the page header')
}
const footerStart = detailPage.indexOf('className="escrow-box-footer-actions"')
const updateButton = detailPage.indexOf('>\n                            Cập nhật\n                        </GamingButton>')
const cancelButton = detailPage.indexOf('>\n                            Hủy box\n                        </GamingButton>')
if (footerStart < 0 || updateButton < footerStart || cancelButton < updateButton) {
    throw new Error('Escrow Box footer must place Cập nhật before Hủy box in the lifecycle action bar')
}
if (!detailPage.includes('navigate(`/account/escrow-boxes/${id}/edit`)')) {
    throw new Error('Escrow Box update action must navigate to the dedicated edit page')
}
console.log('MBN escrow box guard passed.')
