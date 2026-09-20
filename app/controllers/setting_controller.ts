import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { getSettings, previewId, resetSettings, testPrintConfiguration, updateSettings } from '#services/setting_service'
import { idPreviewValidator, settingsValidator, testPrintValidator } from '#validators/setting_validator'

export default class SettingController {
  async show(ctx: HttpContext) {
    try { return sendSuccess('Settings retrieved successfully', await getSettings()) } catch (error) { return ErrorService.handleError(ctx, error) }
  }

  async update(ctx: HttpContext) {
    try { return sendSuccess('Settings saved successfully', await updateSettings(await settingsValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) }
  }

  async reset(ctx: HttpContext) {
    try { return sendSuccess('Settings reset successfully', await resetSettings()) } catch (error) { return ErrorService.handleError(ctx, error) }
  }

  async preview(ctx: HttpContext) {
    try { return sendSuccess('ID preview generated successfully', await previewId(await idPreviewValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) }
  }

  async testPrint(ctx: HttpContext) {
    try { return sendSuccess('Test-print configuration retrieved successfully', await testPrintConfiguration(await testPrintValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) }
  }
}
