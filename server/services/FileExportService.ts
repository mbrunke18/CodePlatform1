import { db } from '../db';
import { sql } from 'drizzle-orm';

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'ms_project_xml';

export interface ExportTask {
  id: string;
  name: string;
  description: string;
  phase: string;
  assignee?: string;
  priority: string;
  status: string;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  dependencies?: string[];
  percentComplete?: number;
}

export interface ExportResult {
  success: boolean;
  format: ExportFormat;
  content: string;
  filename: string;
  mimeType: string;
  size: number;
}

export class FileExportService {
  
  async exportExecutionPlan(
    executionInstanceId: string,
    format: ExportFormat
  ): Promise<ExportResult> {
    const tasks = await this.fetchExecutionTasks(executionInstanceId);
    const metadata = await this.fetchExecutionMetadata(executionInstanceId);
    
    switch (format) {
      case 'csv':
        return this.exportToCsv(tasks, metadata);
      case 'xlsx':
        return this.exportToXlsx(tasks, metadata);
      case 'json':
        return this.exportToJson(tasks, metadata);
      case 'ms_project_xml':
        return this.exportToMsProjectXml(tasks, metadata);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
  
  private async fetchExecutionTasks(executionInstanceId: string): Promise<ExportTask[]> {
    const result = await db.execute(
      sql`SELECT 
            ept.id,
            ept.name,
            ept.description,
            epp.name as phase,
            ept.assigned_to as assignee,
            ept.priority,
            ept.status,
            ept.start_date as "startDate",
            ept.due_date as "dueDate",
            ept.estimated_hours as "estimatedHours",
            ept.dependencies,
            eit.progress as "percentComplete"
          FROM execution_plan_tasks ept
          LEFT JOIN execution_plan_phases epp ON ept.phase_id = epp.id
          LEFT JOIN scenario_execution_plans sep ON epp.plan_id = sep.id
          LEFT JOIN execution_instances ei ON sep.scenario_id = ei.scenario_id
          LEFT JOIN execution_instance_tasks eit ON eit.execution_instance_id = ei.id AND eit.task_id::text = ept.id::text
          WHERE ei.id = ${executionInstanceId}
          ORDER BY epp.sequence_order, ept.sequence_order`
    );
    
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name || '',
      description: row.description || '',
      phase: row.phase || 'Unassigned',
      assignee: row.assignee || '',
      priority: row.priority || 'medium',
      status: row.status || 'pending',
      startDate: row.startDate ? new Date(row.startDate) : undefined,
      dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
      estimatedHours: row.estimatedHours,
      dependencies: row.dependencies || [],
      percentComplete: row.percentComplete || 0,
    }));
  }
  
  private async fetchExecutionMetadata(executionInstanceId: string): Promise<{
    projectName: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    organizationName: string;
  }> {
    const result = await db.execute(
      sql`SELECT 
            ss.title as "projectName",
            ss.description,
            ei.started_at as "startDate",
            ei.completed_at as "endDate",
            o.name as "organizationName"
          FROM execution_instances ei
          LEFT JOIN strategic_scenarios ss ON ei.scenario_id = ss.id
          LEFT JOIN organizations o ON ss.organization_id = o.id
          WHERE ei.id = ${executionInstanceId}`
    );
    
    const row = result.rows[0] as any || {};
    return {
      projectName: row.projectName || 'Execution Plan',
      description: row.description || '',
      startDate: row.startDate ? new Date(row.startDate) : undefined,
      endDate: row.endDate ? new Date(row.endDate) : undefined,
      organizationName: row.organizationName || 'Organization',
    };
  }
  
  private exportToCsv(tasks: ExportTask[], metadata: any): ExportResult {
    const headers = [
      'ID',
      'Task Name',
      'Description',
      'Phase',
      'Assignee',
      'Priority',
      'Status',
      'Start Date',
      'Due Date',
      'Estimated Hours',
      'Percent Complete',
      'Dependencies',
    ];
    
    const rows = tasks.map(task => [
      task.id,
      this.escapeCsvField(task.name),
      this.escapeCsvField(task.description),
      task.phase,
      task.assignee || '',
      task.priority,
      task.status,
      task.startDate?.toISOString().split('T')[0] || '',
      task.dueDate?.toISOString().split('T')[0] || '',
      task.estimatedHours?.toString() || '',
      task.percentComplete?.toString() || '0',
      (task.dependencies || []).join('; '),
    ]);
    
    const csvContent = [
      `# Project: ${metadata.projectName}`,
      `# Organization: ${metadata.organizationName}`,
      `# Exported: ${new Date().toISOString()}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    return {
      success: true,
      format: 'csv',
      content: csvContent,
      filename: `${this.sanitizeFilename(metadata.projectName)}_execution_plan.csv`,
      mimeType: 'text/csv',
      size: Buffer.byteLength(csvContent, 'utf8'),
    };
  }
  
  private exportToXlsx(tasks: ExportTask[], metadata: any): ExportResult {
    const workbook = this.createXlsxContent(tasks, metadata);
    
    return {
      success: true,
      format: 'xlsx',
      content: workbook,
      filename: `${this.sanitizeFilename(metadata.projectName)}_execution_plan.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: Buffer.byteLength(workbook, 'utf8'),
    };
  }
  
  private createXlsxContent(tasks: ExportTask[], metadata: any): string {
    const sheetData = [
      ['Project:', metadata.projectName],
      ['Organization:', metadata.organizationName],
      ['Exported:', new Date().toISOString()],
      [],
      ['ID', 'Task Name', 'Description', 'Phase', 'Assignee', 'Priority', 'Status', 'Start Date', 'Due Date', 'Est. Hours', '% Complete'],
      ...tasks.map(task => [
        task.id,
        task.name,
        task.description,
        task.phase,
        task.assignee || '',
        task.priority,
        task.status,
        task.startDate?.toISOString().split('T')[0] || '',
        task.dueDate?.toISOString().split('T')[0] || '',
        task.estimatedHours || '',
        task.percentComplete || 0,
      ]),
    ];
    
    const xmlSheet = this.createSpreadsheetML(sheetData);
    return xmlSheet;
  }
  
  private createSpreadsheetML(data: any[][]): string {
    const rows = data.map((row, rowIndex) => {
      const cells = row.map((cell, colIndex) => {
        const cellRef = this.getCellRef(colIndex, rowIndex);
        const cellValue = cell !== null && cell !== undefined ? String(cell) : '';
        const isNumber = typeof cell === 'number';
        
        if (isNumber) {
          return `<c r="${cellRef}"><v>${cell}</v></c>`;
        } else {
          return `<c r="${cellRef}" t="inlineStr"><is><t>${this.escapeXml(cellValue)}</t></is></c>`;
        }
      }).join('');
      
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    }).join('');
    
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rows}
  </sheetData>
</worksheet>`;
  }
  
  private getCellRef(col: number, row: number): string {
    let colRef = '';
    let colNum = col;
    while (colNum >= 0) {
      colRef = String.fromCharCode((colNum % 26) + 65) + colRef;
      colNum = Math.floor(colNum / 26) - 1;
    }
    return `${colRef}${row + 1}`;
  }
  
  private exportToJson(tasks: ExportTask[], metadata: any): ExportResult {
    const jsonContent = JSON.stringify({
      metadata: {
        projectName: metadata.projectName,
        description: metadata.description,
        organization: metadata.organizationName,
        exportedAt: new Date().toISOString(),
        taskCount: tasks.length,
      },
      phases: this.groupTasksByPhase(tasks),
      tasks: tasks.map(task => ({
        ...task,
        startDate: task.startDate?.toISOString(),
        dueDate: task.dueDate?.toISOString(),
      })),
    }, null, 2);
    
    return {
      success: true,
      format: 'json',
      content: jsonContent,
      filename: `${this.sanitizeFilename(metadata.projectName)}_execution_plan.json`,
      mimeType: 'application/json',
      size: Buffer.byteLength(jsonContent, 'utf8'),
    };
  }
  
  private exportToMsProjectXml(tasks: ExportTask[], metadata: any): ExportResult {
    const projectStart = metadata.startDate || new Date();
    const projectEnd = metadata.endDate || this.addDays(projectStart, 30);
    
    const taskElements = tasks.map((task, index) => {
      const uid = index + 1;
      const startDate = task.startDate || projectStart;
      const endDate = task.dueDate || this.addDays(startDate, 1);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return `
      <Task>
        <UID>${uid}</UID>
        <ID>${uid}</ID>
        <Name>${this.escapeXml(task.name)}</Name>
        <Type>0</Type>
        <IsNull>0</IsNull>
        <CreateDate>${this.formatMsProjectDate(new Date())}</CreateDate>
        <WBS>${uid}</WBS>
        <OutlineNumber>${uid}</OutlineNumber>
        <OutlineLevel>1</OutlineLevel>
        <Priority>${this.mapPriorityToMsProject(task.priority)}</Priority>
        <Start>${this.formatMsProjectDate(startDate)}</Start>
        <Finish>${this.formatMsProjectDate(endDate)}</Finish>
        <Duration>PT${durationDays * 8}H0M0S</Duration>
        <DurationFormat>7</DurationFormat>
        <Work>PT${(task.estimatedHours || durationDays * 8)}H0M0S</Work>
        <Stop>${this.formatMsProjectDate(endDate)}</Stop>
        <Resume>${this.formatMsProjectDate(startDate)}</Resume>
        <ResumeValid>0</ResumeValid>
        <EffortDriven>1</EffortDriven>
        <Recurring>0</Recurring>
        <OverAllocated>0</OverAllocated>
        <Estimated>1</Estimated>
        <Milestone>0</Milestone>
        <Summary>0</Summary>
        <Critical>0</Critical>
        <IsSubproject>0</IsSubproject>
        <IsSubprojectReadOnly>0</IsSubprojectReadOnly>
        <ExternalTask>0</ExternalTask>
        <EarlyStart>${this.formatMsProjectDate(startDate)}</EarlyStart>
        <EarlyFinish>${this.formatMsProjectDate(endDate)}</EarlyFinish>
        <LateStart>${this.formatMsProjectDate(startDate)}</LateStart>
        <LateFinish>${this.formatMsProjectDate(endDate)}</LateFinish>
        <StartVariance>0</StartVariance>
        <FinishVariance>0</FinishVariance>
        <WorkVariance>0</WorkVariance>
        <FreeSlack>0</FreeSlack>
        <TotalSlack>0</TotalSlack>
        <FixedCost>0</FixedCost>
        <FixedCostAccrual>3</FixedCostAccrual>
        <PercentComplete>${task.percentComplete || 0}</PercentComplete>
        <PercentWorkComplete>${task.percentComplete || 0}</PercentWorkComplete>
        <Cost>0</Cost>
        <OvertimeCost>0</OvertimeCost>
        <OvertimeWork>PT0H0M0S</OvertimeWork>
        <ActualStart>${task.percentComplete ? this.formatMsProjectDate(startDate) : ''}</ActualStart>
        <ActualDuration>PT0H0M0S</ActualDuration>
        <ActualCost>0</ActualCost>
        <ActualOvertimeCost>0</ActualOvertimeCost>
        <ActualWork>PT0H0M0S</ActualWork>
        <ActualOvertimeWork>PT0H0M0S</ActualOvertimeWork>
        <RegularWork>PT${(task.estimatedHours || durationDays * 8)}H0M0S</RegularWork>
        <RemainingDuration>PT${durationDays * 8}H0M0S</RemainingDuration>
        <RemainingCost>0</RemainingCost>
        <RemainingWork>PT${(task.estimatedHours || durationDays * 8)}H0M0S</RemainingWork>
        <RemainingOvertimeCost>0</RemainingOvertimeCost>
        <RemainingOvertimeWork>PT0H0M0S</RemainingOvertimeWork>
        <ACWP>0</ACWP>
        <CV>0</CV>
        <ConstraintType>0</ConstraintType>
        <CalendarUID>-1</CalendarUID>
        <LevelAssignments>1</LevelAssignments>
        <LevelingCanSplit>1</LevelingCanSplit>
        <LevelingDelay>0</LevelingDelay>
        <LevelingDelayFormat>8</LevelingDelayFormat>
        <IgnoreResourceCalendar>0</IgnoreResourceCalendar>
        <Notes>${this.escapeXml(task.description)}</Notes>
        <HideBar>0</HideBar>
        <Rollup>0</Rollup>
        <BCWS>0</BCWS>
        <BCWP>0</BCWP>
        <PhysicalPercentComplete>0</PhysicalPercentComplete>
        <EarnedValueMethod>0</EarnedValueMethod>
        <IsPublished>1</IsPublished>
        <StatusManager>${this.escapeXml(task.assignee || '')}</StatusManager>
        <CommitmentType>0</CommitmentType>
      </Task>`;
    }).join('');
    
    const resourceElements = this.getUniqueAssignees(tasks).map((assignee, index) => `
      <Resource>
        <UID>${index + 1}</UID>
        <ID>${index + 1}</ID>
        <Name>${this.escapeXml(assignee)}</Name>
        <Type>1</Type>
        <IsNull>0</IsNull>
        <MaxUnits>1</MaxUnits>
        <PeakUnits>1</PeakUnits>
        <OverAllocated>0</OverAllocated>
        <CanLevel>1</CanLevel>
        <AccrueAt>3</AccrueAt>
        <Work>PT0H0M0S</Work>
        <RegularWork>PT0H0M0S</RegularWork>
        <OvertimeWork>PT0H0M0S</OvertimeWork>
        <ActualWork>PT0H0M0S</ActualWork>
        <RemainingWork>PT0H0M0S</RemainingWork>
        <ActualOvertimeWork>PT0H0M0S</ActualOvertimeWork>
        <RemainingOvertimeWork>PT0H0M0S</RemainingOvertimeWork>
        <PercentWorkComplete>0</PercentWorkComplete>
        <StandardRate>0</StandardRate>
        <StandardRateFormat>2</StandardRateFormat>
        <Cost>0</Cost>
        <OvertimeRate>0</OvertimeRate>
        <OvertimeRateFormat>2</OvertimeRateFormat>
        <OvertimeCost>0</OvertimeCost>
        <CostPerUse>0</CostPerUse>
        <ActualCost>0</ActualCost>
        <ActualOvertimeCost>0</ActualOvertimeCost>
        <RemainingCost>0</RemainingCost>
        <RemainingOvertimeCost>0</RemainingOvertimeCost>
        <WorkVariance>0</WorkVariance>
        <CostVariance>0</CostVariance>
        <SV>0</SV>
        <CV>0</CV>
        <ACWP>0</ACWP>
        <CalendarUID>-1</CalendarUID>
        <BCWS>0</BCWS>
        <BCWP>0</BCWP>
        <IsGeneric>0</IsGeneric>
        <IsInactive>0</IsInactive>
        <IsEnterprise>0</IsEnterprise>
        <BookingType>0</BookingType>
        <IsBudget>0</IsBudget>
      </Resource>`
    ).join('');
    
    const assignmentElements = tasks.map((task, taskIndex) => {
      if (!task.assignee) return '';
      const resourceIndex = this.getUniqueAssignees(tasks).indexOf(task.assignee);
      if (resourceIndex === -1) return '';
      
      return `
      <Assignment>
        <UID>${taskIndex + 1}</UID>
        <TaskUID>${taskIndex + 1}</TaskUID>
        <ResourceUID>${resourceIndex + 1}</ResourceUID>
        <PercentWorkComplete>${task.percentComplete || 0}</PercentWorkComplete>
        <Units>1</Units>
        <Work>PT${(task.estimatedHours || 8)}H0M0S</Work>
        <RegularWork>PT${(task.estimatedHours || 8)}H0M0S</RegularWork>
        <ActualWork>PT0H0M0S</ActualWork>
        <RemainingWork>PT${(task.estimatedHours || 8)}H0M0S</RemainingWork>
        <Start>${this.formatMsProjectDate(task.startDate || new Date())}</Start>
        <Finish>${this.formatMsProjectDate(task.dueDate || new Date())}</Finish>
        <OvertimeWork>PT0H0M0S</OvertimeWork>
        <ActualOvertimeWork>PT0H0M0S</ActualOvertimeWork>
        <RemainingOvertimeWork>PT0H0M0S</RemainingOvertimeWork>
        <Cost>0</Cost>
        <ActualCost>0</ActualCost>
        <RemainingCost>0</RemainingCost>
        <ActualOvertimeCost>0</ActualOvertimeCost>
        <RemainingOvertimeCost>0</RemainingOvertimeCost>
        <BCWS>0</BCWS>
        <BCWP>0</BCWP>
        <BookingType>0</BookingType>
        <ActualWorkProtected>PT0H0M0S</ActualWorkProtected>
        <ActualOvertimeWorkProtected>PT0H0M0S</ActualOvertimeWorkProtected>
        <CreationDate>${this.formatMsProjectDate(new Date())}</CreationDate>
        <HasFixedRateUnits>1</HasFixedRateUnits>
        <FixedMaterial>0</FixedMaterial>
      </Assignment>`;
    }).filter(Boolean).join('');
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Project xmlns="http://schemas.microsoft.com/project">
  <SaveVersion>14</SaveVersion>
  <Name>${this.escapeXml(metadata.projectName)}</Name>
  <Title>${this.escapeXml(metadata.projectName)}</Title>
  <Subject>${this.escapeXml(metadata.description)}</Subject>
  <Author>M Strategic Execution OS</Author>
  <CreationDate>${this.formatMsProjectDate(new Date())}</CreationDate>
  <LastSaved>${this.formatMsProjectDate(new Date())}</LastSaved>
  <ScheduleFromStart>1</ScheduleFromStart>
  <StartDate>${this.formatMsProjectDate(projectStart)}</StartDate>
  <FinishDate>${this.formatMsProjectDate(projectEnd)}</FinishDate>
  <FYStartDate>1</FYStartDate>
  <CriticalSlackLimit>0</CriticalSlackLimit>
  <CurrencyDigits>2</CurrencyDigits>
  <CurrencySymbol>$</CurrencySymbol>
  <CurrencySymbolPosition>0</CurrencySymbolPosition>
  <CalendarUID>1</CalendarUID>
  <DefaultStartTime>08:00:00</DefaultStartTime>
  <DefaultFinishTime>17:00:00</DefaultFinishTime>
  <MinutesPerDay>480</MinutesPerDay>
  <MinutesPerWeek>2400</MinutesPerWeek>
  <DaysPerMonth>20</DaysPerMonth>
  <DefaultTaskType>1</DefaultTaskType>
  <DefaultFixedCostAccrual>3</DefaultFixedCostAccrual>
  <DefaultStandardRate>0</DefaultStandardRate>
  <DefaultOvertimeRate>0</DefaultOvertimeRate>
  <DurationFormat>7</DurationFormat>
  <WorkFormat>2</WorkFormat>
  <EditableActualCosts>0</EditableActualCosts>
  <HonorConstraints>0</HonorConstraints>
  <InsertedProjectsLikeSummary>1</InsertedProjectsLikeSummary>
  <MultipleCriticalPaths>0</MultipleCriticalPaths>
  <NewTasksEffortDriven>1</NewTasksEffortDriven>
  <NewTasksEstimated>1</NewTasksEstimated>
  <SplitsInProgressTasks>1</SplitsInProgressTasks>
  <SpreadActualCost>0</SpreadActualCost>
  <SpreadPercentComplete>0</SpreadPercentComplete>
  <TaskUpdatesResource>1</TaskUpdatesResource>
  <FiscalYearStart>0</FiscalYearStart>
  <WeekStartDay>1</WeekStartDay>
  <MoveCompletedEndsBack>0</MoveCompletedEndsBack>
  <MoveRemainingStartsBack>0</MoveRemainingStartsBack>
  <MoveRemainingStartsForward>0</MoveRemainingStartsForward>
  <MoveCompletedEndsForward>0</MoveCompletedEndsForward>
  <BaselineForEarnedValue>0</BaselineForEarnedValue>
  <AutoAddNewResourcesAndTasks>1</AutoAddNewResourcesAndTasks>
  <CurrentDate>${this.formatMsProjectDate(new Date())}</CurrentDate>
  <MicrosoftProjectServerURL>1</MicrosoftProjectServerURL>
  <Autolink>1</Autolink>
  <NewTaskStartDate>0</NewTaskStartDate>
  <DefaultTaskEVMethod>0</DefaultTaskEVMethod>
  <ProjectExternallyEdited>0</ProjectExternallyEdited>
  <AdminProject>0</AdminProject>
  <Calendars>
    <Calendar>
      <UID>1</UID>
      <Name>Standard</Name>
      <IsBaseCalendar>1</IsBaseCalendar>
      <IsBaselineCalendar>0</IsBaselineCalendar>
      <BaseCalendarUID>-1</BaseCalendarUID>
      <WeekDays>
        <WeekDay>
          <DayType>1</DayType>
          <DayWorking>0</DayWorking>
        </WeekDay>
        <WeekDay>
          <DayType>2</DayType>
          <DayWorking>1</DayWorking>
          <WorkingTimes>
            <WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime>
            <WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime>
          </WorkingTimes>
        </WeekDay>
        <WeekDay>
          <DayType>3</DayType>
          <DayWorking>1</DayWorking>
          <WorkingTimes>
            <WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime>
            <WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime>
          </WorkingTimes>
        </WeekDay>
        <WeekDay>
          <DayType>4</DayType>
          <DayWorking>1</DayWorking>
          <WorkingTimes>
            <WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime>
            <WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime>
          </WorkingTimes>
        </WeekDay>
        <WeekDay>
          <DayType>5</DayType>
          <DayWorking>1</DayWorking>
          <WorkingTimes>
            <WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime>
            <WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime>
          </WorkingTimes>
        </WeekDay>
        <WeekDay>
          <DayType>6</DayType>
          <DayWorking>1</DayWorking>
          <WorkingTimes>
            <WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime>
            <WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime>
          </WorkingTimes>
        </WeekDay>
        <WeekDay>
          <DayType>7</DayType>
          <DayWorking>0</DayWorking>
        </WeekDay>
      </WeekDays>
    </Calendar>
  </Calendars>
  <Tasks>
    <Task>
      <UID>0</UID>
      <ID>0</ID>
      <Name>${this.escapeXml(metadata.projectName)}</Name>
      <Type>1</Type>
      <IsNull>0</IsNull>
      <CreateDate>${this.formatMsProjectDate(new Date())}</CreateDate>
      <WBS>0</WBS>
      <OutlineNumber>0</OutlineNumber>
      <OutlineLevel>0</OutlineLevel>
      <Priority>500</Priority>
      <Start>${this.formatMsProjectDate(projectStart)}</Start>
      <Finish>${this.formatMsProjectDate(projectEnd)}</Finish>
      <Duration>PT0H0M0S</Duration>
      <DurationFormat>7</DurationFormat>
      <Work>PT0H0M0S</Work>
      <ResumeValid>0</ResumeValid>
      <EffortDriven>0</EffortDriven>
      <Recurring>0</Recurring>
      <OverAllocated>0</OverAllocated>
      <Estimated>0</Estimated>
      <Milestone>0</Milestone>
      <Summary>1</Summary>
      <Critical>0</Critical>
      <IsSubproject>0</IsSubproject>
      <IsSubprojectReadOnly>0</IsSubprojectReadOnly>
      <ExternalTask>0</ExternalTask>
      <FixedCostAccrual>3</FixedCostAccrual>
      <ConstraintType>0</ConstraintType>
      <CalendarUID>-1</CalendarUID>
      <LevelAssignments>1</LevelAssignments>
      <LevelingCanSplit>1</LevelingCanSplit>
      <LevelingDelay>0</LevelingDelay>
      <LevelingDelayFormat>8</LevelingDelayFormat>
      <IgnoreResourceCalendar>0</IgnoreResourceCalendar>
      <HideBar>0</HideBar>
      <Rollup>0</Rollup>
      <EarnedValueMethod>0</EarnedValueMethod>
      <IsPublished>1</IsPublished>
      <CommitmentType>0</CommitmentType>
    </Task>
    ${taskElements}
  </Tasks>
  <Resources>
    ${resourceElements}
  </Resources>
  <Assignments>
    ${assignmentElements}
  </Assignments>
</Project>`;
    
    return {
      success: true,
      format: 'ms_project_xml',
      content: xmlContent,
      filename: `${this.sanitizeFilename(metadata.projectName)}_execution_plan.xml`,
      mimeType: 'application/xml',
      size: Buffer.byteLength(xmlContent, 'utf8'),
    };
  }
  
  private groupTasksByPhase(tasks: ExportTask[]): Record<string, ExportTask[]> {
    return tasks.reduce((acc, task) => {
      const phase = task.phase || 'Unassigned';
      if (!acc[phase]) acc[phase] = [];
      acc[phase].push(task);
      return acc;
    }, {} as Record<string, ExportTask[]>);
  }
  
  private getUniqueAssignees(tasks: ExportTask[]): string[] {
    return Array.from(new Set(tasks.map(t => t.assignee).filter((a): a is string => Boolean(a))));
  }
  
  private formatMsProjectDate(date: Date): string {
    return date.toISOString().replace('Z', '');
  }
  
  private mapPriorityToMsProject(priority: string): number {
    const map: Record<string, number> = {
      critical: 1000,
      high: 700,
      medium: 500,
      low: 300,
    };
    return map[priority.toLowerCase()] || 500;
  }
  
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  private escapeCsvField(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  
  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  private sanitizeFilename(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }
}

export const fileExportService = new FileExportService();
